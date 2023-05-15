import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  const createSpotButton = "createSpotButton" + (sessionUser? "" : " hidden");
  return (
    <div className='headerContainer'>
      <ul className='navigation'>
        <li id='home'>
          <NavLink exact to="/">
            <img src="/favicon.png" alt="logo"></img>
          </NavLink>
          <NavLink exact to="/" id="logo">AuraBnb</NavLink>
        </li>
        {isLoaded && (
        <li id='profile'>
          <NavLink exact to="/spots/new" className={createSpotButton}>
            Create a New Spot
          </NavLink>
          <div>
            <ProfileButton user={sessionUser} />  
          </div>
        </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;