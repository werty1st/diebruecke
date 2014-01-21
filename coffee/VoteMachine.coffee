class DR.BroenGallery.VoteMachine
    hasVotedThisWeek: false 

    constructor: (app)->
        @app = app
        #Hash = require ("js/libs/more")
        @cookie = new Hash.Cookie 'benzErGud2',
            duration: 365

        @currentWeek = @getWeek(new Date())
        @hasVotedThisWeek = this.hasVotedThisWeek()
        return this

    hasVotedThisWeek: ->
        lastVotedWeek = @cookie.get 'week'

        if not lastVotedWeek or lastVotedWeek isnt @currentWeek
            return false
        else
            return true

    vote: (slug) ->
        if @hasVotedThisWeek
            alert 'Sie haben in dieser Woche bereits einmal abgestimmt.'
        else
            voteId = @app.data[slug].voteId

            req = new Request
                url: DR.BroenGallery.config.voteEndpoint + '?qid=5&aid=' + voteId

                onSuccess: =>
                   alert 'Vielen Dank für Ihre Stimme. Sie können nächste Woche noch einmal abstimmen.'
                   @cookie.set 'week', @currentWeek
                   @hasVotedThisWeek = true

                onFailure: ->
                    alert 'Serverfehler! Es wurde keine Stimme vergeben.'

            req.send()
         
    getWeek: (d) ->
        target = new Date(d.valueOf())
        dayNr = (d.getDay() + 6) % 7
        target.setDate(target.getDate() - dayNr + 3)
        jan4 = new Date(target.getFullYear(), 0, 4)
        dayDiff = (target - jan4) / 86400000  
        weekNr = 1 + Math.ceil(dayDiff / 7)

        return weekNr

###
todo
dr-widget-swipe-carousel.js fehlt
swipe.js fehlt
usw
http://requirejs.org/docs/faq-advanced.html namepsace benutzen damit couchdb funktioniert
###