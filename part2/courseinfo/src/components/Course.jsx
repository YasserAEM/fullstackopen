const Header = ({course}) => <h2>{course}</h2>

const Content = ({parts}) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
)

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = (props) => <p><b>Number of exercises {props.total}</b></p>

const Course = ({course}) => {

  const total = course.parts.reduce(
    (accumulator, currentPart) => accumulator + currentPart.exercises,
    0
  )

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  )
}

export default Course