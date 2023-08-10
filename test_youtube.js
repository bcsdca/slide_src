function getStreamInfo(){
  var streamId="6GkALNcMtSUssrwWRXgGYQ";
  YouTube.setTokenService(function(){ return getYouTubeService().getAccessToken(); });
  var resp=YouTube.liveStreamsList("snippet,cdn", {id:streamId});
  return stream_resources[0];
}