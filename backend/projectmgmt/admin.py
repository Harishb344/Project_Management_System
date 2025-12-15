from django.contrib import admin
from .models import Organization, Project, Task, TaskComment
# Register your models here.

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "contact_email")
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "organization", "status", "due_date")
    list_filter = ("name", "status")
    search_fields = ("name", "description")

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "status", "assignee_email")
    list_filter = ("project", "status")
    search_fields = ("title", "description")

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ("task", "author_email", "timestamp")
    list_filter = ("task", "author_email")