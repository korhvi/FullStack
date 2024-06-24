import React from 'react'

const Header = (props) => {
  return <h1>{props.course.name}</h1>
}

const Content = (props) => {
  return (
    <div>
      {props.course.parts.map(part =>
        <Part key={part.name} part={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Total = (props) => {
  const totalExercises = props.course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>Number of exercises {totalExercises}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id : 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14
        id: 3
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App
