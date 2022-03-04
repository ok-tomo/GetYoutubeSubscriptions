import React, { Component } from 'react';
import axios from 'axios';

function VideoPlayer(props) {
  const title = props.title;
  const thumbnail = props.thumbnail;
  const url = 'https://www.youtube.com/watch?v=' + props.videoId;

  return (
    <a href={ url } className='url'>
      <div className="ytplayer">
        <div className='ytthumb'>
          <img src={ thumbnail } alt={ "title:" + title } />
        </div>
        <div className='yttitle'>
          { title }
        </div>
      </div>
    </a>
  )
}

function Channel(props) {
  const url = 'https://www.youtube.com/channel/' + props.data.channelId;

  return (
    <a href={ url } className='url'>
      <div className="channel">
        <div className='channel-icon'>
          <img id='channel-image' src={ props.data.thumbnail } alt={ props.data.title }/>
        </div>
        <div className="channel-name">{ props.data.title }</div>
      </div>
    </a>
  )
}

class VideoLadder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGotVideo: false,
      nextPageToken: null,
      totalResults: null,
      videos: [{
        videoId: null,
        title: null,
        description: null,
        thumbnail: null,
      }]
    }
  }

  getVideos = (id) => {
    const accessToken = this.props.accessToken;
    const channelId = id;
    const maxResults = 10;
    const url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=' + maxResults + '&channelId=' + channelId;
    const addToken = '&access_token=' + accessToken;

    axios.get(url + addToken).then((res) => {
      const nextPageToken = res.data.nextPageToken;
      const totalResults = res.data.pageInfo.totalResults;
      const videos = res.data.items.map((item) => {
        return {
            videoId: item.id.videoId ,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
          }
      });
      this.setState({
        nextPageToken: nextPageToken,
        totalResults: totalResults,
        videos: videos
      })
    });
  }
  
  render() {
    // render内でsetStateは使わない
    if (!this.state.isGotVideo) {
      this.getVideos(this.props.channel.channelId);
      this.setState({ isGotVideo: true });
    }
    let video = null;
    if (this.state.totalResults != null) {
        video = this.state.videos.map((item) => {
        return <VideoPlayer videoId={ item.videoId } title={ item.title } thumbnail={ item.thumbnail } />
      });
    }

    return (
      <div className='ladder'>
        <Channel data={ this.props.channel } />
        { video }
      </div>
    )
  }
}

class Channels extends Component {
  render() {
    const channels = this.props.channels.slice();
    const channel = channels.map((item) => {
      if (item.channelId == null) return null;
      return <VideoLadder channel={ item } accessToken={ this.props.accessToken } />
    });

    return (
      <React.StrictMode>
        <div className="video-ladder">
          { channel }
        </div>
      </React.StrictMode>
    )
  }
}

export default Channels;