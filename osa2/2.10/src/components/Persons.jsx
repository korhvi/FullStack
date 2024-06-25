import React from 'react';

const Person = ({person}) =>{
  return( <div>{person.name} {person.number}</div>)}

const Persons = ({ personsToShow }) => {
  return (
    <ul>
      {personsToShow.map(person => (
        <Person key={person.name} person={person} />
      ))}
    </ul>
  );
};

export default Persons