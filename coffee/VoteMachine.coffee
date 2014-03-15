class DR.BroenGallery.VoteMachine
    hasVotedThisDay: false 

    constructor: (app)->
        @app = app
        require ["js/libs/more"], =>
            @cookie = new Hash.Cookie 'benzErGud2',
                duration: 60

            @currentDay = Date.now()
            @hasVotedThisDay = this.hasVotedThisDay()
            return this

    hasVotedThisDay: ->
        lastVotedDay = @cookie.get 'day'


        if not lastVotedDay or (lastVotedDay+1000*3600*8) < @currentDay
            return false
        else
            return true

    vote: (slug) ->
        if (@app.data[slug].ude)
            alert 'Für diese Person kann nicht mehr abgestimmt werden.'
            return

        if @hasVotedThisDay
            alert 'Sie haben heute bereits einmal abgestimmt.'
            return
        
        voteId = @app.data[slug].voteId + 1763
        myvote = new Request(
            url: "http://vote.zdf.de/gate/"
            method: "POST"
            data:
                aid: voteId
                qid: 591
                auth4: global.auth4
                auth6: global.auth

            onSuccess: (json) =>
                @cookie.set 'day', @currentDay
                @hasVotedThisDay = true
                alert 'Vielen Dank für Ihre Stimme. Sie können Morgen wieder abstimmen.'
                return
        )
        myvote.send()
        return

        # if @hasVotedThisWeek
        #     alert 'Sie haben in dieser Woche bereits einmal abgestimmt.'
        # else
        #     voteId = @app.data[slug].voteId

        #     req = new Request
        #         url: DR.BroenGallery.config.voteEndpoint + '?qid=5&aid=' + voteId

        #         onSuccess: =>
        #            alert 'Vielen Dank für Ihre Stimme. Sie können nächste Woche noch einmal abstimmen.'
        #            @cookie.set 'week', @currentWeek
        #            @hasVotedThisWeek = true

        #         onFailure: ->
        #             alert 'Die Abstimmung ist noch nicht freigeschaltet'

        #     req.send()
         

###
todo
dr-widget-swipe-carousel.js fehlt
swipe.js fehlt
usw
http://requirejs.org/docs/faq-advanced.html namepsace benutzen damit couchdb funktioniert
###