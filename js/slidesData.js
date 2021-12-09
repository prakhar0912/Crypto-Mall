import astroL from "../imgg/astroL.png"
import astroR from "../imgg/astroR.png"
import vr from "../imgg/vr.png"
import coin from "../imgg/coin.png"
import heart from "../imgg/heart.png"
import joys from "../imgg/joys.png"
import roadmapD from "../imgg/roadmapD1.svg"
import roadmapM from "../imgg/roadmapM.svg"
import dudeL from "../imgg/dudeL.svg"
import dudeR from "../imgg/dudeR.svg"


const slidesData = [
  [
    {
      content: `
        <div class="slide-container slide-grid">
          <div class="overlay-new"></div>
          <div class="middle-line liner"></div>
          <div class="left-line liner">
          </div>
          <div class="slide-header landing">
            <h1>METAMALL</h1>
            <p>The Decentralized Metaverse Mall</p>
            <button class='explore'>Enter</button>
          </div>
          <div class="right-line liner">
          </div>
        </div>
      `,
      position: 10,
    },
  ],
  [
    {
      // image: img1,
      content: `
        <div class="slide-container">
          <div class="overlay-new"></div>
          <div class="middle-line liner"></div>
          <div class="yeah">
            <div class="left-line liner">
              <div class='block left-block'></div>
            </div>
            <div class="content-container">
              <section class="intro">
                <div class="left">
                    <img class="skewElem1" src="${astroL}" alt="">
                </div>
                <div class="middle">
                    <h1>INTRODUCING METAMALL</h1>
                    <p>MetaMall will provide an unprecedented VR experience on the blockchain to create, explore and trade
                        in the
                        first-ever virtual mall owned by its users.</p>
                </div>
                <div class="right">
                    <img class="skewElem2"  src="${astroR}" alt="">
                </div>
              </section>
              <section class="vr">
                  <div>
                    <div>
                      <img class="skewElem1"  src="${vr}" alt="">
                    </div>
                    <div>
                        <h1>The Unique</h1>
                        <h1 class="bold">VR Experience</h1>
                        <p>Metamall features a unique VR experience with different themes, architecture and interactive VR
                            properties.
                            Token holders will be known as Metamallers. It will act as a central hub and welcome all levels of
                            crypto
                            experience. For the first time ever, users will have access to crypto information and immersive
                            content all in
                            one place. Metamallers will be able to earn revenue through real estate ownership, advertising
                            revenue, play
                            games, build networks and much more. By using the world’s most advanced real time 3D Creation
                            Engine, Metamall
                            will leverage this technology to create stunning visualisations and user experience.</p>
                    </div>
                  </div>
              </section>
              <section class="coin">
                  <div>
                      <p class="grey">EARN</p>
                      <h1>GENERATE REVENUE THROUGH</h1>
                      <h1>MULTIPLE <b>INCOME STREAMS</b></h1>
                      <p>
                          Metamall will be a land of earning opportunities for Metamallers. Following the IDO, Metamall real
                          estate will be
                          made available for Metamallers to purchase. Other opportunities will consist of passive earning,
                          staking and
                          advertising.
                      </p>
                  </div>
                  <div>
                      <img class="skewElem2"  src="${coin}" alt="">
                  </div>
              </section>
              <section class="heart">
                  <div>
                      <img class="skewElem1"  src="${heart}" alt="">
                  </div>
                  <div>
                      <p class="grey">CREATE & WIN</p>
                      <h1>CREATE YOUR <b>OWN</b></h1>
                      <h1><b>EXPERIENCE</b></h1>
                      <p>
                      On Metamall, users can create stores, games, arena and experiences. Metamall constantly evolves with users’ imagination and creativity which in turn will further enrich user experience and build engagement and wealth on the platform.
                      </p>
                  </div>
                  
              </section>

              <section class="joys">
                  <div>
                      <p class="grey">GAME ON</p>
                      <h1>SHOP, MEET,</h1>
                      <h1>PLAY, <b>WIN</b></h1>
                      <p>
                      Metamallers can have their own high street, lounges and  game zones. Users can organise, host and win competitions on the Metamall as well as shop, meet and engage with friends.
                      </p>
                  </div>
                  <div>
                      <img class="skewElem2"  src="${joys}" alt="">
                  </div>
              </section>

              <section class="roadmap">
                  <div>
                      ${window.innerWidth > 900 ? `<img src="${roadmapD}">` : `<img src="${roadmapM}">`}
                  </div>
              </section>

              <section class="team">
                  <div>
                      <h1 class="boldHeading">THE TEAM</h1>
                  </div>
                  <div class="dudes">
                      <img src="${dudeL}" alt="">
                      <img src="${dudeR}" alt="">
                  </div>
              </section>
            </div>
            <div class="right-line liner">
              <div class='block right-block'></div>
            </div>
          </div>
        </div>
      `,
      position: 0
    },
  ],
];
export { slidesData }