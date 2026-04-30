import django_filters
from django.db.models import Count
from submissions import models


class SubmissionFilterSet(django_filters.FilterSet):
    """Basic filter set for the submissions list endpoint.

    Only the status filter is implemented so the candidate can extend the
    remaining filters (broker, company search, optional extras, etc.).
    """

    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")

    # Required extras
    brokerId = django_filters.NumberFilter(field_name="broker_id")
    companySearch = django_filters.CharFilter(field_name="company__legal_name", lookup_expr="icontains")

    # Optional extras
    createdFrom = django_filters.DateFilter(field_name="created_at", lookup_expr="date__gte")
    createdTo = django_filters.DateFilter(field_name="created_at", lookup_expr="date__lte")
    hasDocuments = django_filters.BooleanFilter(method="filter_has_documents")
    hasNotes = django_filters.BooleanFilter(method="filter_has_notes")

    class Meta:
        model = models.Submission
        fields = ["status"]

    def filter_has_documents(self, queryset, name, value):
        queryset = queryset.annotate(_doc_count=Count("documents", distinct=True))
        return queryset.filter(_doc_count__gt=0) if value else queryset.filter(_doc_count=0)

    def filter_has_notes(self, queryset, name, value):
        queryset = queryset.annotate(_note_count=Count("notes", distinct=True))
        return queryset.filter(_note_count__gt=0) if value else queryset.filter(_note_count=0)