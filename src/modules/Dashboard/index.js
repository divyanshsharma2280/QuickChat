import React, { useState, useEffect } from "react";
import avatar from '../../assets/user-circle.svg'
import Input from "../../components/Input";
const Dashboard = () => {
    const contacts = [
        {
            name: 'John',
            status: 'Available',
            img: avatar
        },
        {
            name: 'Alexander',
            status:'Available',
            img: avatar
        },
        {
            name: 'Adam',
            status:'Available',
            img: avatar
        },
        {
            name: 'Alex',
            status:'Available',
            img: avatar
        },
        {
            name: 'Larry',
            status:'Available',
            img: avatar
        }
        
    ]
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user:detail');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user:detail');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const [conversation, setConversation] = useState([]);

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

    const [messages,setMessages] = useState([])

    const fetchMessages = async(conversationId) => {
        const res = await fetch(`http://localhost:8000/api/message/${conversationId}`,{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        });
        const resData = await res.json()
        console.log("fetchedmessages:>>", resData);
        setMessages(resData)
    }
    return(
        <div className="w-screen flex">
            <div className="w-[25%] h-screen bg-secondary">
                <div className="flex items-center my-8 mx-14">
                    <div className="border border-primary p-[2px] rounded-full"><img src={avatar} width={75} height={75}/></div>
                    <div className="ml-4">
                        <h3 className="text-2xl">{user.fullName}</h3>
                        <p className="text-lg font-light">My Account</p>
                    </div>
                </div>
                <hr/>
                <div className="mx-12 mt-5">
                    <div className="text-primary text-lg">Messages</div>
                    <div>
                        {
                        conversation.length >0 ?
                        conversation.map(({conversationId, user}) => {
                            return(
                                <div className="flex items-center py-4 border-b border-b-gray-300">
                                <div className="cursor-pointer flex items-center" onClick={() =>
                                    fetchMessages(conversationId)
                                }>
                                <div className=""><img src={avatar} width={50} height={50}/></div>
                                <div className="ml-6">
                                <h3 className="text-lg">{user?.fullName}</h3>
                                <p className="text-lg font-light text-gray-600">{user?.email}</p>
                                </div>
                                </div>
                                </div>
                            )
                        }) : <div className="text-center text-lg font-semibold mt-24">No conversations</div>
                        
                    }
                    </div>
                </div>
            </div>
            <div className="w-[50%]  h-screen bg-white flex flex-col items-center">
                <div className="w-[75%] bg-secondary h-[65px] my-5 rounded-full flex items-center px-2 shadow-md">
                    <div className=""><img src={avatar} width={60} height={60}/></div>
                    <div className="ml-4">
                    <h4 className="text-lg">Alexander</h4>
                    <p className="text-sm font-light text-gray-600">Online</p>
                    </div>
                </div>
                <div className="h-[110%] border w-full overflow-scroll custom-scrollbar">
                    <div className="p-14">
                        {
                            messages.length >0 ?
                            messages.map(({ message, user: messageUser }) => {
                                if (messageUser?.id === user?.id) {
                                    return (
                                        <div key={message} className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white mb-6">
                                            {message}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={message} className='max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-3 mb-6'>
                                            {message}
                                        </div>
                                    );
                                }

                            }) : <div className="text-center text-lg font-semibold mt-24">No Messages </div>
                        }

                    </div>
                    
                </div>
                <div className="p-6 w-full flex items-center">
                        <Input placeholder="Type a message..." className='w-[75%]' inputClassName="p-4 border-0 shadow-md rounded-full bg-secondary focus:ring-0 focus:border-0 outline-none"/>
                        <div className="ml-4 p-4 cursor-pointer bg-secondary rounded-full mt-2 shadow-md">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-send"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                        </div>
                        <div className="ml-4 p-4 cursor-pointer bg-secondary rounded-full mt-2 shadow-md">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                        </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard;