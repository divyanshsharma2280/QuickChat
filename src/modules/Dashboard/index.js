import React, { useState, useEffect } from "react";
import avatar from '../../assets/user-circle.svg'
import Input from "../../components/Input";
import './index.css';
import { io } from 'socket.io-client'

const Dashboard = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user:detail');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [conversation, setConversation] = useState([]);
    const [users,setUsers] = useState([])
    const [messages,setMessages] = useState({})
    const [message,setMessage] = useState('')
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user:detail');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    useEffect(() => {
        const fetchConversations = async () => {
            if (user) {
                try {
                    const res = await fetch(`http://localhost:8000/api/conversation/${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const resData = await res.json();
                    setConversation(resData);
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            } else {
                console.log('No user found for fetching conversations.');
            }
        };

        fetchConversations();
    }, [user]);

    useEffect(() => {
        const fetchUsers = async() => {
            const res = await fetch(`http://localhost:8000/api/users/${user?.id}`,{
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                }
            });
            const resData = await res.json()
            setUsers(resData)
        }
        fetchUsers()
    },[])

    const fetchMessages = async(conversationId, receiver) => {
        const res = await fetch(`http://localhost:8000/api/message/${conversationId}`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                receiverId: receiver.receiverId,
                senderId: user?.id
            })

        });
        const resData = await res.json()
        console.log("fetchedmessages:>>", resData);
        setMessages({messages: resData, receiver, conversationId})
        console.log("this is it:" ,messages)
    }

    const sendMessage = async(e) => {
        const res = await fetch(`http://localhost:8000/api/message`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })
        });
        setMessage('')
    }



    const [colors, setColors] = useState({
        div1: 'bg-gradient-to-r from-orange-500 to-orange-300',
        div2:'bg-gradient-to-r from-orange-500 to-orange-300',
        div3: 'bg-white',
        div4:'bg-gradient-to-l from-orange-400 to-orange-300',
        div5: 'bg-orange-200',
        div6: 'text-black',
        div7: 'text-black',
        div8: 'bg-primary'
      });
    
      const switchColors = () => {
        if (colors.div1 === 'bg-gradient-to-r from-orange-500 to-orange-300') {
          setColors({
            div1: 'bg-slate-950',
            div2:'bg-gray-600',
            div3: 'bg-slate-950',
            div4: 'bg-gray-950',
            div5: 'bg-slate-900',
            div6: 'text-white',
            div7: 'text-primary',
            div8: 'bg-primary'
          });
        } else {
          setColors({
            div1: 'bg-gradient-to-r from-orange-500 to-orange-300',
            div2:'bg-gradient-to-r from-orange-500 to-orange-300',
            div3: 'bg-white',
            div4:'bg-gradient-to-l from-orange-500 to-orange-300',
            div5: 'bg-orange-200',
            div6: 'text-black',
            div7: 'text-black',
            div8: 'bg-gray-900'
          });
        }
      };


    return(
        <div className="w-screen flex">
            <div className={`rounded-[25px] w-[24%] ml-[0.5%] mr-[0.5%] h-50vh ${colors.div1} transition-all duration-500 delay-100`}>
                <div className="flex items-center my-8 mx-14">
                    <div className="border border-primary p-[2px] rounded-full"><img src={avatar} width={75} height={75}/></div>
                    <div className="ml-4">
                        <h3 className={`text-2xl ${colors.div6}`}>{user.fullName}</h3>
                        <p className={`text-lg font-light${colors.div6}`}>My Account</p>
                    </div>
                </div>
                <hr/>
                <div className="mx-12 mt-5">
                    <div className="text-white text-lg">Messages</div>
                    <div>
                        {
                        conversation.length >0 ?
                        conversation.map(({conversationId, user}) => {
                            return(
                                <div className=" cursor-pointer flex items-center py-4  hover:bg-orange-300 hover:rounded-[10px] border-b border-b-gray-300"
                                onClick={() =>
                                    fetchMessages(conversationId, user)
                                }>
                                <div className=" flex  items-center">
                                <div className=""><img src={avatar} width={50} height={50}/></div>
                                <div className="ml-6">
                                <h3 className={`text-lg ${colors.div6}`}>{user?.fullName}</h3>
                                <p className={`text-lg ${colors.div6} font-light`}>Online</p>
                                </div>
                                </div>
                                </div>
                            )
                        }) : <div className="text-center text-lg font-semibold mt-24">No conversations</div>
                        
                    }
                    </div>
                </div>
            </div>
            <div className={`w-[50%] rounded-[25px] h-screen flex flex-col items-center ${colors.div3} transition-all duration-500 delay-100`}>
                {
                        messages?.receiver?.fullName &&
                        <div className={`w-[75%] h-[65px] my-5 rounded-full flex items-center px-2 shadow-md ${colors.div2} transition-all duration-500 delay-100`}>
                            <div className=""><img src={avatar} width={60} height={60}/></div>
                            <div className="ml-4">
                            <h4 className="text-lg text-white">{messages?.receiver?.fullName}</h4>
                            <p className="text-sm font-light text-white">{messages?.receiver?.email}</p>
                            </div>
                        </div>
                }
                <div className={`scrollbar-hide custom-scrollbar-hover rounded-[15px] h-[110%] border w-full overflow-scroll custom-scrollbar ${colors.div5} transition-all duration-500 delay-100`}>
                    <div className="p-14">
                        {
                            messages?.messages?.length >0 ?
                            messages.messages.map(({ message, user: messageUser }) => {
                                console.log('messageUser id:', messageUser?.id, 'user id:', user?.id);
                                if (messageUser?.id === user?.id) {
                                    return (
                                        <div key={message} className="max-w-[40%] bg-secondary rounded-b-xl rounded-tl-xl ml-auto p-3 mb-6">
                                            {message}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={message} className='max-w-[40%] bg-orange-400 rounded-b-xl rounded-tr-xl text-white p-3 mb-6'>
                                            {message}
                                        </div>
                                    );
                                }

                            }) : <div className={`text-center text-lg font-semibold mt-24 ${colors.div6}`}>No Messages </div>
                        }

                    </div>
                    
                </div>
                {
                    messages?.receiver?.fullName &&
                        <div className="p-6 w-full flex items-center">
                        <Input placeholder="Type a message..."  value={message}  onChange={(e) => setMessage(e.target.value)} className='w-[75%]' inputClassName="p-4 border-0 shadow-md rounded-full bg-secondary focus:ring-0 focus:border-0 outline-none"/>
                        <div className={`ml-4 p-4 cursor-pointer bg-secondary rounded-full mt-2 shadow-md ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()} >
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-send"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                        </div>
                        <div className="ml-4 p-4 cursor-pointer bg-secondary rounded-full mt-2 shadow-md">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                        </div>
                    </div>
                }

            </div>
            <div className={`w-[24%] ml-[0.5%] mr-[0.5%] rounded-[25px] h-screen px-8 py-16 ${colors.div4} transition-all duration-500 delay-100`}>
                <div className="flex justify-end absolute top-0 right-0 mt-4 mr-4">
                <button
                    class={`align-middle select-none font-sans font-semibold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-3 rounded-[25px] ${colors.div8} text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85]  focus:shadow-none active:opacity-[0.85] active:shadow-none`}
                    type="button"
                    data-ripple-light="true"
                    onClick={switchColors}
                >   Dark/Light Mode </button>
                </div>
                <div className={`${colors.div7} text-xl font-sans font-bold`}>People</div>
                <div>
                        {
                        users.length >0 ?
                        users.map(({userId, user}) => {
                            return(
                                <div className="flex items-center py-4 border-b border-b-gray-300">
                                <div className="cursor-pointer flex items-center" onClick={() =>
                                    fetchMessages('new', user)
                                }>
                                <div className=""><img src={avatar} width={50} height={50}/></div>
                                <div className="ml-6">
                                <h3 className={`text-lg ${colors.div6}`}>{user?.fullName}</h3>
                                <p className={`text-lg font-light ${colors.div6}`}>{user?.email}</p>
                                </div>
                                </div>
                                </div>
                            )
                        }) : <div className="text-center text-lg font-semibold mt-24">No conversations</div>
                        
                    }
                    </div>
            </div>
        </div>
    )
}

export default Dashboard;
