/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

const CELL_SIZE = 50;

const Arena1 = () => {
  const params = {
    token: "1234",
    spaceId: "Winterz"
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const [currentUser, setCurrentUser] = useState<any>({})
  const [users, setUsers] = useState(new Map())
  const [userMessages, setUserMessages] = useState(new Map())
  const [msg, setMsg] = useState<string>("")

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");
  
    socketRef.current.on("connect", () => {
      setCurrentUser({ x: 1, y: 1, userId: socketRef.current!.id });
    });
  
    socketRef.current.on("current-users", (allUsers) => {
      setUsers(new Map(allUsers.map((user: any) => [user.userId, user])));
    });
  
    socketRef.current.on("user-joined", (payload) => {
      setUsers((prev) => {
        const newUsers = new Map(prev);
        newUsers.set(payload.userId, payload);
        return newUsers;
      });
    });
  
    socketRef.current.on("user-moved", (payload) => {
      setUsers((prev) => {
        const newUsers = new Map(prev);
        if (newUsers.has(payload.userId)) {
          newUsers.set(payload.userId, { ...newUsers.get(payload.userId), x: payload.x, y: payload.y });
        }
        return newUsers;
      });
    });
  
    socketRef.current.on("user-left", (userId) => {
      setUsers((prev) => {
        const newUsers = new Map(prev);
        newUsers.delete(userId);
        return newUsers;
      });
    });

    socketRef.current.on("recieve-message", (payload) => {
      setUserMessages((prev) => {
        const newUsers = new Map(prev)
        newUsers.set(payload.userId, payload.message)
        return newUsers
      })
    })
    
  
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  

  // handleMovement
  const handleMove = (x: number, y: number) => {
    if (!currentUser) return;
    socketRef.current?.emit("move", { x, y, userId: currentUser.userId });
    setCurrentUser((prev: any) => ({ ...prev, x, y }));
  };  

  const sendMessage = () => {
    socketRef.current?.emit("message", msg)
  }

  // draw arena
  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return

    const ctx = canvas.getContext("2d")
    if(!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // grid
    ctx.strokeStyle = "#eee"

    for(let i = 0; i < canvas.width; i += CELL_SIZE) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    for(let i = 0; i < canvas.height; i += CELL_SIZE) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    if(currentUser) {
      ctx.beginPath()
      ctx.fillStyle = "red"
      ctx.arc (
        currentUser.x * CELL_SIZE,
        currentUser.y * CELL_SIZE,
        20,
        0,
        Math.PI * 2
      )
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      if(msg == "") {
        ctx.fillText("You", currentUser.x * CELL_SIZE, currentUser.y * CELL_SIZE + 40);
      }else {
        ctx.fillText(msg, currentUser.x * CELL_SIZE, currentUser.y * CELL_SIZE + 40);
      }
    }

    users.forEach((user) => {
      ctx.beginPath()
      ctx.fillStyle = "#4ECDC4"
      ctx.arc(user.x * CELL_SIZE, user.y * CELL_SIZE, 20, 0, Math.PI * 2);
      ctx.fill()
      ctx.fillStyle = "#000"
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      console.log("redrawing")
      const message = userMessages.get(user.userId)
      if (message) {
        ctx.fillText(message, user.x * CELL_SIZE, user.y * CELL_SIZE + 40)
      } else {
        ctx.fillText(`User ${user.userId}`, user.x * CELL_SIZE, user.y * CELL_SIZE + 40)
      }
      // ctx.fillText(`User ${user.userId}`, user.x * CELL_SIZE, user.y * CELL_SIZE + 40);
    })

  }, [users, currentUser, msg, setUserMessages, userMessages])
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!currentUser) return;
    const { x, y } = currentUser;

    switch (e.key) {
      case "ArrowUp":
        handleMove(x, y - 1);
        break;
      case "ArrowDown":
        handleMove(x, y + 1);
        break;
      case "ArrowLeft":
        handleMove(x - 1, y);
        break;
      case "ArrowRight":
        handleMove(x + 1, y);
        break;
    }
  };

  return(
      <div className="flex h-screen bg-gray-100">
        {/* Left: Arena */}
        <div
          className="flex-1 p-4"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <h1 className="text-2xl font-bold mb-4">Arena</h1>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Token: {params.token}</p>
            <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
            <p className="text-sm text-gray-600">
              Connected Users: {users.size + (currentUser ? 1 : 0)}
            </p>
          </div>
    
          <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
            <canvas
              ref={canvasRef}
              width={1000}
              height={500}
              className="bg-white w-full"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Use arrow keys to move your avatar
          </p>
        </div>
    
        {/* Right: Chat */}
        <div className="w-80 bg-white border-l shadow-lg flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Here you can later show messages list */}
            <p className="text-sm text-gray-400 italic">
              No messages yet...
            </p>
          </div>
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-400"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )    
}

export default Arena1