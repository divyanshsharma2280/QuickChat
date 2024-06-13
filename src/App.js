import React, { useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Routes, Route, Navigate } from 'react-router-dom';
import Form from './modules/Form';
import Dashboard from './modules/Dashboard';
import './App.css';
import './index.css';

const ProtectedRoute = ({ children , auth=false}) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null||false;
  const currentPath = window.location.pathname;

  if (!isLoggedIn && currentPath !== '/users/sign_up' && auth) {
    
    return <Navigate to={'/users/sign_up'} />;
  } else if (isLoggedIn && (currentPath === '/users/sign_in' || currentPath === '/users/sign_up')) {
    
    return <Navigate to={'/'} />;
  }

  return children;
};


function App() {
  const [showIntro, setShowIntro] = useState(true);
  const comp = useRef(null);

  useLayoutEffect(() => {
    if (showIntro) {
      let ctx = gsap.context(() => {
        const t1 = gsap.timeline({
          onComplete: () => setShowIntro(false),
        });
        t1.from("#intro-slider", {
          xPercent: "-100",
          duration: 1,
          delay: 0.3,
        })
          .from(["#title-1", "#title-2", "#title-3"], {
            opacity: 0,
            y: "+=30",
            stagger: 0.2,
          })
          .to(["#title-1", "#title-2", "#title-3"], {
            opacity: 0,
            y: "-=30",
            delay: 0.1,
            stagger: 0.2,
          })
          .to("#intro-slider", {
            xPercent: "-100",
            duration: 0.5,
          })
          .from("#welcome", {
            opacity: 0,
            duration: 0.5,
          })
          .to("#welcome", {
            opacity: 0,
            duration: 0.5,
            delay: 0.5,
          })
          .from("#login-signup", {
            y: "100%",
            duration: 1,
            opacity: 0,
            ease: "power3.out",
          });
      }, comp);

      return () => ctx.revert();
    }
  }, [showIntro]);

  if (showIntro) {
    return (
      <div className="relative" ref={comp}>
        <div
          id="intro-slider"
          className="h-screen p-10 bg-blue-600 absolute top-0 left-0 font-spaceGrotesk z-10 w-full flex flex-col gap-10 tracking-tight"
        >
          <h1 className="text-9xl text-gray-100" id="title-1">
            For
          </h1>
          <h1 className="text-9xl text-gray-100" id="title-2">
            the
          </h1>
          <h1 className="text-9xl text-gray-100" id="title-3">
            Branch Changers
          </h1>
        </div>
        <div className="h-screen flex bg-blue-400 justify-center place-items-center">
          <h1
            id="welcome"
            className="text-9xl font-bold text-gray-100 font-spaceGrotesk"
          >
            Lets Connect..
          </h1>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute auth={true}>
          <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path='/users/sign_in' element={
        <ProtectedRoute>
          <Form isSignInPage={true}/>
        </ProtectedRoute>
      }/>
      <Route path='/users/sign_up' element={
        <ProtectedRoute>
          <Form isSignInPage={false}/>
        </ProtectedRoute>
      }/>
    </Routes>
  );
}

export default App;


/* write program to return sum of two numbers*/
