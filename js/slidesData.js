import image1 from "../images/img1.jpg"
import landingImage from "../images/landing.jpg"
import astroL from "../images/astroL.png"
import astroR from "../images/astroR.png"
// import video1 from "../video/KingsAuto.mp4"

const slidesData = [
  [
    {
      image: landingImage,
      content: `
        <div class="slide-container">
          <div class="slide-header">
            <button class='explore'>Enter</button>
          </div>
        </div>
      `,
      position: 10,
    },
  ],
  [
    {
      image: image1,
      content: `
        <div class="slide-container">
          <div class="slide-desc slide-desc-iframe">
            <div class="yeah">
              <section class="intro">
                <div class="left">
                  <img src="${astroL}" alt="">
                </div>
                <div class="middle">
                  <h1>INTRODUCING METAMALL</h1>
                  <p>MetaMall will provide an unprecedented VR experience on the blockchain to create, explore and trade in the
                    first-ever virtual mall owned by its users.</p>
                </div>
                <div class="right">
                  <img src="${astroR}" alt="">
                </div>
              </section>
              <section>
                <div>
                  <h1>The Unique</h1>
                  <h1>VR Experience</h1>
                  <p>Metamall features a unique VR experience with different themes, architecture and interactive VR properties.
                    Token holders will be known as Metamallers. It will act as a central hub and welcome all levels of crypto
                    experience. For the first time ever, users will have access to crypto information and immersive content all in
                    one place. Metamallers will be able to earn revenue through real estate ownership, advertising revenue, play
                    games, build networks and much more. By using the world’s most advanced real time 3D Creation Engine, Metamall
                    will leverage this technology to create stunning visualisations and user experience.</p>
                </div>
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