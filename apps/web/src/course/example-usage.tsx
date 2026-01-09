import { allCourses } from "content-collections";

export function CoursesList() {
  return (
    <div>
      <h1>General Elective Courses</h1>
      <ul>
        {allCourses.map((course) => (
          <li key={course.slug}>
            <h2>{course.name}</h2>
            <p>Code: {course.code}</p>
            <p>Day: {course.day}</p>
            <div>
              <p>Classes:</p>
              <ul>
                {course.class.map((cls, index) => (
                  <li key={index}>
                    Group {cls.group}: {cls.start} - {cls.end}
                  </li>
                ))}
              </ul>
            </div>
            <p>Instructor: {course.instructor}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CourseByCode({ code }: { code: string }) {
  const course = allCourses.find((c) => c.code === code);
  if (!course) {
    return <div>Course not found</div>;
  }
  return (
    <div>
      <h1>{course.name}</h1>
      <p>Code: {course.code}</p>
      <p>Day: {course.day}</p>
      <div>
        <p>Classes:</p>
        <ul>
          {course.class.map((cls, index) => (
            <li key={index}>
              Group {cls.group}: {cls.start} - {cls.end}
            </li>
          ))}
        </ul>
      </div>
      <p>Instructor: {course.instructor}</p>
    </div>
  );
}
