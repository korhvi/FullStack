import React from 'react';

const Header = ({course}) => {
  return <h1>{course.name}</h1>;
};

const Content = ({course}) => {
  return (
    <div>
      {course.parts.map(part => (
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Part = ({part, exercises}) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Total = ({course}) => {
  const totalExercises = course.parts.reduce( (sum, part) => 
     sum + part.exercises, 0);

  return( <p>Total exercises: {totalExercises}</p> 
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2,
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3,
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4, 
      },
    ],
  };

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default App;
