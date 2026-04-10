import graphene 
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment

#==============
# Graph QL Types
#==============

class OrganizationType(DjangoObjectType):
    
    class Meta:
        model=Organization
        fields= ("id", "name", "slug", "contact_email")

class ProjectType(DjangoObjectType):
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()
    tasks = graphene.List(lambda: TaskType)

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "status",
            "description",
            "due_date",
        )

    # ✅ FIX 1: Always return iterable
    def resolve_tasks(self, info):
        return list(Task.objects.filter(project=self))

    # ✅ FIX 2: NEVER use self.tasks here
    def resolve_total_tasks(self, info):
        return Task.objects.filter(project=self).count()

    def resolve_completed_tasks(self, info):
        return Task.objects.filter(
            project=self,
            status="done"
        ).count()

    def resolve_completion_rate(self, info):
        total = Task.objects.filter(project=self).count()
        if total == 0:
            return 0.0
        completed = Task.objects.filter(
            project=self,
            status="done"
        ).count()
        return round((completed / total) * 100, 2)


class TaskType(DjangoObjectType):
    class Meta:
        model=Task
        fields=(
            "id", "title", "description", "status",
            "assignee_email", "due_date",  "project"
        )

class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = ("id", "content", "author_email", "timestamp", "task")
    
#===================
# Queries
#===================

class Query(graphene.ObjectType):

    #This line is removed
    #because client will able to list all organizations
    # organizations= graphene.List(OrganizationType)

    projects= graphene.List(ProjectType)
    tasks= graphene.List(TaskType, project_id=graphene.ID(required=True))
    task_comments = graphene.List(
        TaskCommentType,
        task_id=graphene.ID(required=True)
    )

    # def resolve_organizations(root,info):
    #     return Organization.objects.all()


    
    def resolve_projects(root, info):
        org = info.context.organization
        if not org:
            raise Exception("Organization header missing")
        return Project.objects.filter(organization=org)
    
    def resolve_tasks(root, info, project_id):
        # return Task.objects.filter(project_id=project_id)
        org = info.context.organization
        if not org:
            raise Exception("Organization header missing")

        return Task.objects.filter(
            project_id=project_id,
            project__organization=org
        )
    def resolve_task_comments(self, info, task_id):
        org = info.context.organization
        if not org:
            raise Exception("Organization header missing")

        return TaskComment.objects.filter(
            task_id=task_id,
            task__project__organization=org
        ).order_by("-timestamp")
    
schema= graphene.Schema(query=Query)


# let's define the mutation

class CreateProject(graphene.Mutation):
    class Arguments:
        name              =graphene.String(required=True)
        status            =graphene.String(required=True)
        description       =graphene.String()
        due_date          =graphene.Date()
    
    project = graphene.Field(lambda: ProjectType)

    def mutate(self, info, name, status, description=None, due_date=None):
        

        org = info.context.organization
        if not org:
            raise Exception("Orgnization header missing")

        project = Project.objects.create(
            organization=org,
            name = name,
            status = status,
            description = description,
            due_date = due_date
        )
        return CreateProject(project=project)

#===============
# update project mutation
#===============

class UpdateProject(graphene.Mutation):
        class Arguments:
             project_id = graphene.ID(required=True)
             name       = graphene.String()
             status     = graphene.String()
             description= graphene.String()
             due_date   = graphene.Date()

        project = graphene.Field(ProjectType)

        def mutate(self, info, project_id, name=None, status=None, description=None, due_date=None):
            project = Project.objects.get(id=project_id)

            if name:
                project.name=name
            if status:
                project.status=status
            if description:
                project.description=description
            if due_date:
                project.due_date=due_date
            
            project.save()

            return UpdateProject(project=project)


#===============
# Create task mutation
#===============

class CreateTask(graphene.Mutation):
    class Arguments:
        project_id    = graphene.ID(required=True)
        title         = graphene.String(required=True)
        description   = graphene.String()
        status        = graphene.String(required=True)
        assignee_email= graphene.String()
    
    task = graphene.Field(TaskType)

    def mutate(self, info, project_id, title, status, description=None, assignee_email=None):
        project = Project.objects.get(id=project_id)

        task= Task.objects.create(
            project         =project,
            title           =title,
            status          =status,
            description     =description,
            assignee_email  =assignee_email
        )
        return CreateTask(task=task)
    
#===============
# Update task mutation
#===============


# we kept only task_id and status fields
# In business requirements the screener only wants to see the status of the task
class UpdateTask(graphene.Mutation):
       class Arguments:
        task_id       =graphene.ID(required=True)
        status        =graphene.String()
    
       task = graphene.Field(TaskType)

       def mutate(self, info, task_id, status=None):
           org = info.context.organization
           if not org:
              raise Exception("Organization header missing")
           
           task= Task.objects.get(
               id=task_id,
               project__organization=org
           )
           if task.status == "done":
                raise Exception("Completed tasks cannot be modified")

           task.status=status
           task.save()

           project= task.project
           total_tasks= project.tasks.count()
           completed_tasks= project.tasks.filter(status="done").count()

           if total_tasks>0 and completed_tasks== total_tasks:
                project.status="completed"
           elif completed_tasks>0:
                project.status="active"
           else:
                project.status="active"

           project.save();

           return UpdateTask(task=task)

#===============
# add task comment
#===============

class AddTaskComment(graphene.Mutation):
    class Arguments:
        task_id      = graphene.ID(required=True)
        content      = graphene.String(required=True)
        author_email = graphene.String(required=True)
    
    comment= graphene.Field(TaskCommentType)

    def mutate(self, info, task_id, content, author_email):
        task= Task.objects.get(id=task_id)

        comment = TaskComment.objects.create(
            task    = task,
            content =content,
            author_email=author_email
        )

        return AddTaskComment(comment=comment)



#=============================
# Register mutations in schema
#==============================


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()

    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()

    add_task_comment = AddTaskComment.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
