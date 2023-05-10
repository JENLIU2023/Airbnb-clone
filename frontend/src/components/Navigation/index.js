import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  const createSpotButton = "createSpotButton" + (sessionUser? "" : " hidden");
  return (
      <ul className='navigation'>
        <li id='home'>
          <NavLink exact to="/">Home</NavLink>
        </li>
        {isLoaded && (
        <li id='profile'>
          <NavLink exact to="/spots/new" className={createSpotButton}>
            Create a New Spot
          </NavLink>
          <ProfileButton user={sessionUser} />
        </li>
        )}
      </ul>
  );
}

export default Navigation;