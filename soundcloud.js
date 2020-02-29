// https://codepen.io/nickcolley/pen/in

$(document).ready(function(){
  
  var player = SC.Widget($('iframe.sc-widget')[0]);
  var isPlaying = false;

  window.player = player;
  window.SC = SC;

  player.bind(SC.Widget.Events.READY, function() {
    setInfo();
    player.play();
  });
  
  player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
    $('.position').css('width', ( e.relativePosition*100)+"%");
    setTime();
  });

  player.bind(SC.Widget.Events.PAUSE, function(e) {
    isPlaying = false;
    setInfo();
  });

  player.bind(SC.Widget.Events.PLAY, function(e) {
    isPlaying = true;
    setInfo();
  });

  $(document).on('keydown', function(e){
    switch(e.keyCode){
      case 32:
        player.toggle();
        e.preventDefault();
      break;
      case 39:
        player.next();
        e.preventDefault();
      break;
      case 37:
        player.prev();
        e.preventDefault();
      break;
    }
  });

  $('.player').click(function(e){ //Use the position to seek when clicked
    var pOffset = $('.player').offset();
    var pWidth = $('.player').width();
    var scrub = e.pageX-pOffset.left;
    var seek = player.duration*(scrub/pWidth); 
    $('.position').css('width',scrub+"px");
    player.seekTo(seek);
  });
    
  $('.song_title').click(function(){
    player.toggle();
  });
 
  function msToTime(s) {
    function pad(n, z) {
      z = z || 2;
      return ('00' + n).slice(-z);
    }
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
  }

  function setTime() {
    player.getPosition(function(value){
      player.position = value;
    });
    var time = msToTime(player.position);
    $('.song_title_time').html(' ('+time+')');
  }

  function setInfo() {
    player.getDuration(function(value){
      player.duration = value;
    });

    player.getCurrentSound(function(song) {
      
        // Soundcloud just borked this api endpoint, hence this hack :/
        var waveformPng =
            song.waveform_url
                .replace('json', 'png')
                .replace('wis', 'w1');
              
      $('.waveform').css('background-image', "url('" + waveformPng + "')");
      var icon = (isPlaying) ? '&#10073;&#10073; ' : '▶ ';
      $('.song_title_button').html(icon);
      $('.song_title_info').html(song.title);
      setTime();
      
      player.current = song;
    });

  }   

});


