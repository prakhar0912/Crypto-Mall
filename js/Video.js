import gsap from "gsap"


class Video {
    constructor(data) {
        this.part = 0
        this.section = 0
        this.videos = this.createVideos(data)
        this.videoContainer = document.querySelector('.video')
    }

    createVideos(data) {
        let videos = []
        for (let i = 0; i < data.length; i++) {
            let innerVideos = []
            for (let j = 0; j < data[i].length; j++) {
                let videoLink
                if(data[i][j].video){
                    videoLink = data[i][j].video
                }
                else{
                    videoLink = false
                }
                innerVideos.push(videoLink)
            }
            videos.push(innerVideos)
        }
        console.log(videos)
        return videos
    }

    changePartSection(part, section){
        this.part = part
        this.section = section
        console.log(this.videos[this.part][this.section])
        if(this.videos[this.part][this.section] != false){
            console.log('arst')
            this.videoChange()
        }
        else{
            this.removeVideo()
        }
    }

    videoChange(){
        let videoDiv = document.createElement("video")
        videoDiv.autoplay = true
        videoDiv.muted = true
        videoDiv.loop = true
        videoDiv.src = this.videos[this.part][this.section]
        this.videoContainer.appendChild(videoDiv)
    }

    removeVideo(){
        this.videoAnime = gsap.to(this.videoContainer, {
            opacity: 0, duration: 0.2, onComplete:() => {
                this.videoContainer.innerHTML = ''
            }
        })
    }

    hideVideo(duration = 0.3){
        this.videoAnime = gsap.to(this.videoContainer, {
            opacity: 0, duration: duration
        })
    }

    showVideo(duration = 0.3){
        this.videoAnime = gsap.to(this.videoContainer, {
            opacity: 1, duration: duration, delay: 1
        })
    }
}

export {
    Video
}