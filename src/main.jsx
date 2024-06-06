import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth'
import awsmobile from './aws-exports.js';
import amplifyconfig from './amplifyconfiguration.json';
import { generateClient } from 'aws-amplify/api';
import { getProperties, getUrl, downloadData } from 'aws-amplify/storage';



Amplify.configure(amplifyconfig)

let cap_json = [];
let par_json = [];
let slideshow_json = [];
let upcoming_json = [];
let current_json = [];

let capShows = [];
let parShows = [];
let slideshow = [];
let upcomingShows = [];
let currentShows = [];

let capRecieved = false;
let parRecieved = false;
let slideRecieved = false;
let upcomingRecieved = false;
let currentRecieved = false;






const start = async () => {
  const fetchData = async () => {
    cap_json = await fetchCapShows();
    par_json = await fetchParShows();
    slideshow_json = await fetchSlideshow();
    upcoming_json = await fetchUpShows();
    current_json = await fetchCurrShows();
    if (capRecieved && parRecieved && slideRecieved && upcomingRecieved && currentRecieved) {
      console.log('Data Recieved No Wait');
      capShows = JSON.parse(cap_json);
      parShows = JSON.parse(par_json);
      slideshow = JSON.parse(slideshow_json);
      currentShows = JSON.parse(current_json);
      upcomingShows = JSON.parse(upcoming_json);
      root();
    } else {
      console.log('waiting');
      wait();
    }
  };

  const fetchCapShows = async () => {
    try {
      const getCapShows = await downloadData({
        path: 'public/schedule/RTS_Schedule_Capitol.json',
        CacheControl: "must-revalidate"
      }).result;
      const json = await (getCapShows.body).text();
      capRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const fetchParShows = async () => {
    let parData = []
    try {
      const getParShows = await downloadData({
        path: 'public/schedule/RTS_Schedule_Paramount.json',
        CacheControl: "must-revalidate"
      }).result;
      var json = await (getParShows.body).text();
      parRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const fetchSlideshow = async () => {
    let slideData = []
    try {
      const getSlideshow = await downloadData({
        path: 'public/slideshow/slideshow.json',
        CacheControl: "must-revalidate"
      }).result;
      var json = await (getSlideshow.body).text();
      slideRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const fetchUpShows = async () => {
    try {
      const getUpShows = await downloadData({
        path: 'public/schedule/Upcoming.json',
        CacheControl: "must-revalidate"
      }).result;
      const json = await (getUpShows.body).text();
      upcomingRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const fetchCurrShows = async () => {
    try {
      const getCurrShows = await downloadData({
        path: 'public/schedule/Current.json',
        CacheControl: "must-revalidate"
      }).result;
      const json = await (getCurrShows.body).text();
      currentRecieved = true;
      return json;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const wait = () => {
    if (capRecieved && parRecieved && slideRecieved && upcomingRecieved && currentRecieved) {
      root();
    } else {
      setTimeout(wait, 1);
    }
  }

  fetchData();
};

const refreshToken = async () => {
  try {
    const currentSession = await fetchAuthSession({ forceRefresh: true });
    start();
  } catch (e) {
    console.log('Unable to refresh Token', e);
  }
};
refreshToken();

const root = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App
        capShows={capShows}
        parShows={parShows}
        slideshow={slideshow}
        upcomingShows={upcomingShows}
        currentShows={currentShows}
        dataReceived={capRecieved && parRecieved && slideRecieved && upcomingRecieved && currentRecieved}
      />
    </React.StrictMode>,
  )
};
