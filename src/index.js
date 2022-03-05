import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Channels from './app.js';
import './index.css';

const CLIENT_ID = process.env.REACT_APP_YOUTUBE_CLIENT_ID;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false,
            accessToken: null,
            channelData: [{
              channelId: null,
              title: null,
              description: null,
              thumbnail: null,
            }]
        }
    }

    loginSuccess = (res) => {
      const accessToken = res.wc.access_token;
      this.getMySubscriptions(accessToken);
      this.setState({ isSignedIn: true, accessToken: accessToken });
    }

    loginFailure = (res) => {
      /* 失敗処理 */
      console.log(JSON.stringify(res));
    }

    getMySubscriptions = (accessToken) => {
      const url = 'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=10';
      const addToken = '&access_token=' + accessToken;

      axios.get(url + addToken).then(res => {
        const channels = res.data.items.map((item) => {
          const channelId = item.snippet.resourceId.channelId;

          return {
            channelId: channelId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
          }
        });
        this.setState({ channelData: channels });
      });
    }

    render() {
        const channels = (this.state.isSignedIn) ? <Channels channels={ this.state.channelData } accessToken={ this.state.accessToken } /> : null;

        return (
          <React.Fragment>
            <header className="header">
              <div className='icon'></div>
              <div className="brand">YTSubs</div>
              <div className='form-wrapper'>
                {/* <input id='inputbox' type="text" value='Search keyword' /> */}
              </div>
              <div className="loginButton">
                <GoogleLogin
                  clientId={ CLIENT_ID }
                  render={renderProps => (
                    <div className='icon-button'>
                      <Button onClick={ renderProps.onClick } disabled={ renderProps.disabled }>
                        <Avatar alt='My Account Name'src={ '' } />
                      </Button>
                    </div>
                  )}
                  onSuccess={ this.loginSuccess }
                  onFailure={ this.loginFailure }
                  scope={ 'https://www.googleapis.com/auth/youtube.readonly' }
                  cookiePolicy={ 'single_host_origin' }
                  isSignedIn={ true }
                />
              </div>
            </header>
            <div className="body-wrapper">
              { channels }
            </div>
          </React.Fragment>
        );
    }
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);