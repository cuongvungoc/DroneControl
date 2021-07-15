L.Playback = L.Playback || {};

L.Playback.Control = L.Control.extend({

  initialize: function(playback) {
    this.playback = playback;
    playback.addCallback(this._clockCallback);
  },

  onAdd: function(map) {
    var html = this._html;
    $('#map').after(html);
    this._setup();

    // just an empty container
    // TODO: dont do this
    return L.DomUtil.create('div');
  },

  _setup: function() {
    var self = this;
    var playback = this.playback;
    $('#play-pause').click(function() {
      if (playback.isPlaying() === false) {
        playback.start();
        $('#play-pause-icon').removeClass('fa-play');
        $('#play-pause-icon').addClass('fa-pause');
      } else {
        playback.stop();
        $('#play-pause-icon').removeClass('fa-pause');
        $('#play-pause-icon').addClass('fa-play');
      }
    });

    var startTime = playback.getStartTime();
    $('#cursor-date').html(L.Playback.Util.DateStr(startTime));
    $('#cursor-time').html(L.Playback.Util.TimeStr(startTime));

    $('#time-slider').slider({
      min: playback.getStartTime(),
      max: playback.getEndTime(),
      step: playback.getTickLen(),
      value: playback.getTime(),
      slide: function( event, ui ) {
        playback.setCursor(ui.value);
        $('#cursor-time').val(ui.value.toString());
        $('#cursor-time-txt').html(new Date(ui.value).toString());
      }
    });

    $('#speed-slider').slider({
      min: -9,
      max: 9,
      step: .1,
      value: self._speedToSliderVal(this.playback.getSpeed()),
      orientation: 'vertical',
      slide: function( event, ui ) {
        var speed = self._sliderValToSpeed(parseFloat(ui.value));
        playback.setSpeed(speed);
        $('.speed').html(speed).val(speed);
      }
    });

    $('#speed-input').on('keyup', function(e) {
      var speed = parseFloat($('#speed-input').val());
      if (!speed) return;
      playback.setSpeed(speed);
      $('#speed-slider').slider('value', speedToSliderVal(speed));
      $('#speed-icon-val').html(speed);
      if (e.keyCode === 13) {
        $('.speed-menu').dropdown('toggle');
      }
    });

    $('#date-input').on('keyup', function(e) {
      $('#calendar').datepicker('setDate', $('#date-input').val());
    });

    $('.dropdown-menu').on('click', function(e) {
      e.stopPropagation();
    });


  },

  _clockCallback: function(ms) {
    $('#cursor-date').html(L.Playback.Util.DateStr(ms));
    $('#cursor-time').html(L.Playback.Util.TimeStr(ms));
    $('#time-slider').slider('value', ms);
  },

  _speedToSliderVal: function(speed) {
    if (speed < 1) return -10+speed*10;
    return speed - 1;    
  },

  _sliderValToSpeed: function(val) {
    if (val < 0) return parseFloat((1+val/10).toFixed(2));
    return val + 1;    
  },

  _combineDateAndTime: function(date, time) {
    var yr = date.getFullYear();
    var mo = date.getMonth();
    var dy = date.getDate();
    // the calendar uses hour and the timepicker uses hours...
    var hr = time.hours || time.hour;
    if (time.meridian === 'PM' && hr !== 12) hr += 12;
    var min = time.minutes || time.minute;
    var sec = time.seconds || time.second;
    return new Date(yr, mo, dy, hr, min, sec).getTime();    
  },

});