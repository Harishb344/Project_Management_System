from django.db import models
from django.utils.text import slugify
# Create your models here.


class Organization(models.Model):
    name=models.CharField(max_length=255)
    slug=models.SlugField(max_length=255, unique=True)
    contact_email=models.EmailField()

    def save(self, *args, **kwargs):
        
        if not self.slug:
            self.slug=slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


#==========================
#    Project Model
#==========================

class Project(models.Model):

    STATUS_ACTIVE="active"
    STATUS_ONHOLD="on hold"
    STATUS_COMPLETED="completed"

    STATUS_CHOICES=[
        (STATUS_ACTIVE, "active"),
        (STATUS_ONHOLD, "on hold"),
        (STATUS_COMPLETED, "completed"),
    ]

    organization= models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="projects"
    )
    
    name= models.CharField(max_length=255)
    status= models.CharField(max_length=32, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    description= models.TextField(blank=True)
    due_date= models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.organization.slug})"


#======================
# Task Model
#======================

class Task(models.Model):
    STATUS_TODO="todo"
    STATUS_IN_PROGRESS="in_progress"
    STATUS_DONE= "done"

    STATUS_CHOICES=[
        (STATUS_TODO, "To Do"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_DONE, "Done"),
    ]

    project=models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks"
    )
    title= models.CharField(max_length=255)
    description=models.TextField(blank=True)
    status=models.CharField(max_length=32, choices=STATUS_CHOICES, default=STATUS_TODO)
    assignee_email=models.EmailField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
         return f"{self.title} [{self.project.name}]"


#======================
# Task Comment Model
#======================

class TaskComment(models.Model):
    task=models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    content= models.TextField()
    author_email= models.EmailField()
    timestamp= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author_email} on {self.task.title}"