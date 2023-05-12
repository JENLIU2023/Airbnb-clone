import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route, NavLink } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetSpotList from "./components/SpotList";
import GetSpotDetails from "./components/SpotDetails"
import CreateSpot from "./components/CreateSpot";
import GetCurrentSpots from "./components/GetCurrentSpots";
import UpdateSpot from "./components/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path="/" component={GetSpotList} />
        <Route exact path="/spots/new" component={CreateSpot}/>
        <Route exact path="/spots/current" component={GetCurrentSpots} />
        <Route exact path="/spots/:spotId" component={GetSpotDetails} />
        <Route exact path="/spots/:spotId/edit" component={UpdateSpot} />
      </Switch>
    </>
  );
}

export default App;