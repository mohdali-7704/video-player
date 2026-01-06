import { CourseLoader } from '@/lib/utils/courseLoader';
import CourseGrid from '@/components/course/CourseGrid';

export default async function HomePage() {
  const catalog = await CourseLoader.loadCatalog();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Course Certification Platform
          </h1>
          <p className="mt-2 text-gray-600">
            Choose a course to begin your certification journey
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CourseGrid courses={catalog.courses} />
      </main>
    </div>
  );
}
