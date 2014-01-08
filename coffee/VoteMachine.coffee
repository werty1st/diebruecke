class DR.BroenGallery.VoteMachine
    hasVotedThisWeek: false 

    constructor: (app)->
        @app = app
        require ["more"], =>
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
            alert 'Du har allerede afgivet din stemme i denne uge.'
        else
            voteId = @app.data[slug].voteId

            req = new Request
                url: DR.BroenGallery.config.voteEndpoint + '?qid=5&aid=' + voteId

                onSuccess: =>
                   alert 'Tak for din stemme. Du kan stemme igen næste uge.'
                   @cookie.set 'week', @currentWeek
                   @hasVotedThisWeek = true

                onFailure: ->
                    alert 'fejl!'

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