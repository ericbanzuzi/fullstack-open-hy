const Header = ({ course }) => <h1>{course}</h1>

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part) => 
                <Part key={part.id} name={part.name} exercises={part.exercises}/>
            )}
        </div>
    )
}

const Total = ({ sum }) => <b>Number of exercises {sum}</b>

const Part = ({ name, exercises }) => <p>{name} {exercises} </p>

const Course = ({ course }) => {
    return (
        <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((sum, part) => part.exercises + sum, 0)} />
        </div>
    )
  }
  
  export default Course