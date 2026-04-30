from django.test import TestCase
from django.urls import reverse
from submissions.models import Broker, Company, TeamMember, Submission

class SubmissionFilterTests(TestCase):
    def setUp(self):
        self.broker = Broker.objects.create(name="Test Broker", primary_contact_email="a@b.com")
        self.company = Company.objects.create(legal_name="Acme Corp", industry="Tech", headquarters_city="NYC")
        self.owner = TeamMember.objects.create(full_name="Jane Doe", email="jane@example.com")
        Submission.objects.create(broker=self.broker, company=self.company, owner=self.owner, status="new", priority="high")
        Submission.objects.create(broker=self.broker, company=self.company, owner=self.owner, status="closed", priority="low")

    def test_status_filter(self):
        response = self.client.get(reverse('submission-list'), {'status': 'new'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_company_search_filter(self):
        response = self.client.get(reverse('submission-list'), {'companySearch': 'acme'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)

    def test_detail_includes_contacts(self):
        sub = Submission.objects.first()
        response = self.client.get(reverse('submission-detail', args=[sub.id]))
        self.assertIn('contacts', response.data)