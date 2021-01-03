var Web = {
  debounceTime : 150,

  // DOM references
  dom : {
    html : $( 'html' ),
    body : $( 'body' ),
    links: $( 'a' ),
    tables: $( 'table' ).not( '.calendar-table' ),
    formControl: $( '.form-control' )
  },

  defBreakPoints : {
    // Supported breakpoints with value from (including self)
    // help: 320 <= xs < 576 <= sm < 768 <= md < 992 <= lg < 1200 <= xl
    xs : 320,
    sm : 576,
    md : 768,
    lg : 992,
    xl : 1200
  },

  // Get current breakpoint
	getCurrentBreakPoint : function() {
		var width = Web.getDeviceScreenX(),
        bps = Web.defBreakPoints,
        breakpoint;

		for( var key in bps ) {
			var size = bps[key];

			if ( width >= size ) {
				breakpoint = key;
			}
		}

		return breakpoint;
  },

  // Get PixelRatio
  getPixelRatio : function() {
    window.devicePixelRatio = window.devicePixelRatio || Math.round( window.screen.availWidth / document.documentElement.clientWidth );

    return window.devicePixelRatio;
  },

  // Get Device Screen width
	getDeviceScreenX : function() {
		return window.innerWidth;
	},

  // Get Device Screen width
  getDeviceScreenY : function() {
    return window.innerHeight;
  },

  // Functions
  getLang: function() {
    return Web.dom.html.attr( 'lang' );
  },

  externalLinks : function() {
    var locationPattern =
          Web.dom.html.attr( 'data-location' ) ?
            Web.dom.html.attr( 'data-location' ) :
            window.location.origin,
        extPattern = 'http',
        eC = 'external',
        extTitle = {
          cs : 'Externí odkaz - otevře se do nového okna',
          en : 'External link - open in a new window',
          de : 'Externer Link - öffnet in neuem Fenster',
          fr : 'Lien externe - ouvre dans une nouvelle fenêtre'
        }
    ;

    Web.dom.links.each(function() {
      var _this = $( this ),
          href = _this.attr( 'href' );

      if ( href ) {
        if ( href.match( '^' + extPattern ) && !href.match( '^' + locationPattern ) ) {
          _this
            .addClass( eC )
            .attr( 'title', extTitle[Web.getLang()] )
            .attr( 'target', '_blank' );
        }
      }
    });
  },

  scrollTo : function(el, time) {
    var speed = time || 750;

    el.animate({
      scrollTop: 0
    }, speed);
  },

  equalHeight : function( parent, el, action ) {
    if ( parent.length ) {

      var holder = parent,
          box = el,
          action = action || '';

      if ( action == 'reset' ) {
        $( box ).height('auto');
      }

      if ( Web.getCurrentBreakPoint() != 'xs' ) {
        holder.each(function() {
          var _this = $( this ),
              tallest = 0,
              boxes = _this.find( box );

            boxes.each(function() {
              var thisHeight = $( this ).height();

              if( thisHeight > tallest ) {
                tallest = thisHeight;
              }
            });

            boxes.height(tallest);
        });
      }
    }
  },

  resizeWindow : function() {
    $( window ).resize($.debounce(Web.debounceTime, function() {
      Web.equalHeightSum( 'reset' );
    }));
  },

  equalHeightSum : function( action ){
    var act = action || '';

    Web.equalHeight( $( '.boxes--eq' ), '.box__title', action );
    Web.equalHeight( $( '.boxes--eq' ), '.box__text', action );
  },

  fillTableColumn : function() {
    Web.dom.tables.each(function() {
      var thCount = $( this ).find( 'thead tr' ).children().length;

      for ( i = 0; i <= thCount; i++ ) {
        $( this ).find( 'tbody tr td:nth-of-type(' + i + ')' ).each(function() {
          var theadValue = $( this ) .closest( 'table' ).find( 'thead th:nth-child(' + i + ')' ).text();
          $( this ).before( '<span class="td--before">' + theadValue + '</span>' );
        });
      };
    });
  },

  showHideAccordionContent : function() {
    $('.accordion__link').click(function(e) {
      e.preventDefault();

      $( this ).closest( '.accordion' ).toggleClass( 'accordion--open' );
    })
  },

  datePicker : function(){
    var date_input = $( 'input[name="date"]' ),
        date_icon = date_input.next( '.date-picker--icon' ),
        container = $( '.bootstrap-iso form' ).length > 0 ? $( '.bootstrap-iso form' ).parent() : "body",
        fromIcon = false;

    date_input.datepicker({
      format: 'd. MM yyyy',
      language: 'cs',
      container: container,
      todayHighlight: true,
      autoclose: true,
      keyboardNavigation: true,
      showOnFocus: true,
      templates: {
        leftArrow: 'a',
        rightArrow: 'b'
      },
    }).on('hide', function(e) {
      // Back on input after opened front icon
      if ( fromIcon ) {
        date_icon.focus();
        fromIcon = false;
      }
    });

    date_icon.on('click', function(){
      date_input.focus();
    });
    
    date_icon.keypress(function (e) {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        date_input.focus();
        fromIcon = true;
      }
    });
  },

  calendar : function(){
    var btnPreviousMonth = $( '#btnPreviousMonth' )[0];
    var btnNextMonth = $( '#btnNextMonth' )[0];
    var calendarLabel = $( '.calendar-label' )[0];
    var calendarEvent = $( '.calendar-event > div' )[0];
    var monthAndYear = $('#monthAndYear')[0];

    if (btnPreviousMonth) {
      btnPreviousMonth.addEventListener('click', function() {previous();});
    }
    if (btnNextMonth) {
      btnNextMonth.addEventListener('click', function() {next();});
    }

    today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    
    months = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    
    calendarEvents = [
      {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9),
        time: '10.00 - 11.00',
        name: 'Schůzka na katastrálním úřadě'
      },
      {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        time: '',
        name: 'Končí platnost řidičského průkazu'
      }
    ];

    showCalendar(currentMonth, currentYear);
    
    // simulate events in calendar
    var futureEvents = calendarEvents.filter(function (x) {
      var eventDate = x.date;
      return (eventDate.getDate() >= today.getDate()) && (eventDate.getMonth() >= today.getMonth()) && (eventDate.getFullYear() >= today.getFullYear());
    });
    if (futureEvents.length) {
      showEvent(futureEvents[0].date);
    } else {
      showEvent(today);
    }
    
    function next() {
      currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
      currentMonth = (currentMonth + 1) % 12;
      showCalendar(currentMonth, currentYear);
    }
    
    function previous() {
      currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
      currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
      showCalendar(currentMonth, currentYear);
    }
    
    function showCalendar(month, year) {
      tbl = $('.calendar-tbody')[0]; 
      if (!tbl || !monthAndYear) return;
      tbl.innerHTML = '';
      monthAndYear.innerHTML = months[month] + ' ' + year;
      var firstCalendarDay = startOfWeek(new Date(year, month, 1));
      var date = firstCalendarDay;
      for (var i = 0; i < 6; i++) {
        var row = document.createElement('tr');

        for (var j = 0; j < 7; j++) {
          cell = document.createElement('td');
          btn = document.createElement('button');
          btn.type = 'button';
          var monthString = date.getMonth() + 1;
          if (monthString < 10) monthString = '0' + monthString;
          var dateString = date.getDate();
          if (dateString < 10) dateString = '0' + dateString;
          btn.setAttribute('date', date.getFullYear() + '-' + monthString + '-' + dateString);
          btn.classList.add('btn');
          btn.classList.add('btn-lg');
          btn.classList.add('btn-calendar');
          cellText = document.createTextNode(date.getDate());

          if (date.getDate() === today.getDate() && date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
            btn.classList.add('today');
          }

          if (date.getMonth() != month) {
            btn.classList.add('non-actual');
          }

          // simulate events in calendar
          var selectedDateEvents = calendarEvents.filter(function (x) {
            var eventDate = x.date;
            return (eventDate.getDate() === date.getDate()) && (eventDate.getMonth() === date.getMonth()) && (eventDate.getFullYear() === date.getFullYear());
          });
          if (selectedDateEvents.length) {
            btn.classList.add('event');
          }

          btn.addEventListener('click', function() {
            var oldActive = $('.active')[0];
            if (oldActive) oldActive.classList.remove('active');
            this.classList.add('active');

            var btnDate = new Date(this.getAttribute('date'));
            showEvent(btnDate);
          });

          btn.appendChild(cellText);
          cell.appendChild(btn);
          row.appendChild(cell);
          date.setDate(date.getDate() + 1);    
        }
        tbl.appendChild(row);
      }
    }

    function showEvent(selectedDate) {
      if (!calendarEvent || !calendarLabel) return;

      var selectedDateEvents = calendarEvents.filter(function (x) {
        var eventDate = x.date;
        return (eventDate.getDate() === selectedDate.getDate()) && (eventDate.getMonth() === selectedDate.getMonth()) && (eventDate.getFullYear() === selectedDate.getFullYear());
      });

      var hours = '';

      if (selectedDateEvents.length) {
        var event = selectedDateEvents[0];
        hours = ' | ' + (event.time || 'Celý den');
        calendarEvent.innerHTML = event.name;
      } else {
        calendarEvent.innerHTML = 'Nemáte žádné události';
      }

      calendarLabel.innerHTML = selectedDate.getDate() + '. ' + (selectedDate.getMonth() + 1) + '. ' + selectedDate.getFullYear() + hours;
    }

    function startOfWeek(date){
      var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    }
  },

  showHideContent: function() {
    $('[data-toggle="action"]').click(function(e) {
      e.preventDefault();

      var arrow = $(this).find('.arrow');

      if ($(arrow).length > 0 ) {
        $(arrow).toggleClass('pvs-theme-icon-arrow-down');
        $(arrow).toggleClass('pvs-theme-icon-arrow-up');
      }

      var content = $(this).closest('[data-toggle="container"]').find('[data-toggle="content"]');
      $(content).toggleClass('active');

    });
  },

  formFields : function() {
    Web.dom.formControl.each(function(){
      var $this = $( this ),
          notEmptyC = 'form-control--not-empty';

      // init
      if ( $this.val().length > 0 ) {
          $this.addClass( notEmptyC );
      }

      // on change
      $this.change(function(){
        if ( $this.val().length > 0 ) {
          $this.addClass( notEmptyC );
        } else {
          $this.removeClass( notEmptyC );
        }
      });

    });
  },

	fileInput: function() {
		var fileInputs = $( '.inputfile' ),
			fileDrop = $( '[data-toggle="file-drop"]' );

		fileInputs.each( function() {
			var input = $( this ),
				fileElement = input.prev( '.drop-area__file' );

			input.change( function( e ) {
				var fileName = '';

				if ( input[0].files && input[0].files.length > 1 ) {
					fileName = input[0].getAttribute( 'data-multiple-caption' ).replace( '{count}', input[0].files.length );
				} else {
					fileName = e.target.value.split( '\\' ).pop();
				}

				if ( fileName !== '' ) {
					fileElement.text( fileName );
				}
			});

			// Firefox bug fix
			input.focus( function() {
				input.addClass( 'has-focus' );
			});

			input.blur( function() {
				input.removeClass( 'has-focus' );
      });
      
      input.next('label').on('keyup', function(e) {
          if (e.key === ' ' || e.key === 'Spacebar') {
            input.trigger('click');
          }
        });
		});

		fileDrop.each( function() {
			var fileDropElement = $( this ),
				fileDropInput = fileDropElement.find( '.inputfile' );

			fileDropElement.on( 'dragenter dragover', function() {
				fileDropElement.addClass( 'drop-area--over' );
				return false;
			}).on( 'dragleave', function() {
				fileDropElement.removeClass( 'drop-area--over' );
				return false;
			}).on( 'drop', function(e) {
				e.preventDefault();
				e.stopPropagation();

				fileDropElement.removeClass( 'drop-area--over' );

				e.dataTransfer = e.originalEvent.dataTransfer;

				if ( e.dataTransfer.items ) {
					for (var i = 0; i < e.dataTransfer.items.length; i++) {
						if ( e.dataTransfer.items[i].kind === 'file' ) {
							var droppedFiles = e.dataTransfer.files;
							fileDropInput[0].files = droppedFiles;
						}
					}
				}
			});
		});
	},

  toggleNav : function () {
    var navButton = $('#toggleNavBtn');
    var navButtonText = $('.nav-section__toggle-btn div');
    var navSection = $('.nav-section');
    var navInner = $('.nav-section__wrapper');

    navButton.click(function() {
       $(this).toggleClass('open');
       navSection.toggleClass('mobile');
       navInner.toggle(0, function() {
         if ($(this).is(':visible')) {
           navSection.addClass('active');
           navButtonText.text('ZAVŘÍT');
         } else {
           navSection.removeClass('active');
           navButtonText.text('MENU');
         }
       });
     });

     $('.nav--sub').parent('.nav__item').addClass('has-submenu');

     var navItemWithSubMenu = $('.has-submenu .nav__link');
     var navItem = $('.nav__item');
     var subMenu = $('.nav--sub');

     navItemWithSubMenu.click(function(event) {
       event.preventDefault();
       $(this).parent(navItem).toggleClass('open');
       $(this).next(subMenu).toggle();
     });

     $(window).resize(function () {
       navSection.removeClass('mobile active');
       navItem.removeClass('open');
       subMenu.hide();
       if ( $(window).width() >= 992 ) {
         navInner.show();
       }
       if ( $(window).width() < 992 ) {
         navInner.hide();
         navButton.removeClass('open');
         navButtonText.text('MENU');
       }
     });
  },

  tabs : function() {
    var tab = $('.tabs__link');
    var tabContent = $('.guide');

    tab.click(function(e) {
      var tabContentId = $(this).attr('href');

      e.preventDefault();
      tab.removeClass('tabs__link--active');
      tabContent.removeClass('guide--visible');
      $(this).addClass('tabs__link--active');
      $(tabContentId).addClass('guide--visible');
      Web.equalHeightSum('reset');
    });
  },

  toggleSearch : function() {
    var searchBtn = $('#search-toggle');
    var searchBox = $('#search');
    var searchInput = $('#search-input');

    searchBtn.click(function(e) {
      e.preventDefault();
      searchBox.toggleClass('open');
      searchInput.slideToggle(0, function() {
        if ($(this).is(':visible')) {
          searchBox.addClass('active');
          searchBtn.text('ZRUŠIT');
        } else {
          searchBox.removeClass('active');
          searchBtn.text('VYHLEDAT');
        }
      });
    });

    $(window).resize(function () {
      if (searchInput.is(':visible')) {
        searchInput.hide(0);
        searchBox.removeClass('open active');
      }
    });
  },

  // Init function
  init : function() {
    Web.resizeWindow();
    Web.equalHeightSum();
    Web.fillTableColumn();
    Web.showHideAccordionContent();
    Web.datePicker();
    Web.calendar();
    Web.externalLinks();
    Web.showHideContent();
    Web.formFields();
    Web.fileInput();
    Web.toggleNav();
    Web.tabs();
    Web.toggleSearch();
  }
};

/* Document ready */
$(function () {
  Web.init();
});
