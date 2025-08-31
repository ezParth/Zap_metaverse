import { useNavigate } from "react-router-dom"


const Arena = () => {
    const navigate = useNavigate()
    const handleArenaClick = (name: string) => {
        navigate(`/arena/${name}`)
    }

    return (
        <div>
            Arena
            <button onClick={() => handleArenaClick("Arena1")}>Arena1</button>
            <button onClick={() => handleArenaClick("Arena2")}>Arena2</button>
            <button onClick={() => handleArenaClick("Arena3")}>Arena3</button>
        </div>
    )
}

export default Arena