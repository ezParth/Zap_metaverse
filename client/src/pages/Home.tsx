import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  const handleArena = () => {
    navigate("/arenas")
  }

    return (
      <div>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
        <button onClick={handleArena}>Arena</button>
      </div>
    )
  }

  export default Home