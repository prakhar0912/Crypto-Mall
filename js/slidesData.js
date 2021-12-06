import image1 from "../images/img1.jpg"
import landingImage from "../images/landing.jpg"
import landingLogo from "../images/landingLogo.svg"
import landingStudio from "../images/studio.svg"
import video1 from "../video/KingsAuto.mp4"

const slidesData = [
  [
    {
      image: landingImage,
      content: `
        <div class="slide-container slide-grid">
          <div class="slide-header">
            <div class="slide-title title-center ">
              <img src="${landingLogo}">
              <img src="${landingStudio}">
            </div>
          </div>
        </div>
      `,
      position: 10,
    },
  ],
  [
    {
      image: image1,
      video: video1,
      content: `
        <div class="slide-container">
          <div class="slide-desc slide-desc-iframe">
            <div class="yeah">
              <section>

              </section>
              <section>

              </section>
              <section>
                
              </section>
              <section>

              </section>
              <section>
                
              </section>
            </div>
          </div>
        </div>
      `,
      position: 0
    },
  ],
];
export {slidesData}