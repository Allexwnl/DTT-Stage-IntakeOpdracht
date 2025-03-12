<template>
  <div id="container">
    <div id="about-page-container">
      <h1>About this page</h1>
      <p>The objective of this page is to display, create, edit, and delete house entries. However, several issues have
        been identified:
      </p>
      <ul>
        <li>
          <p> Editing Issues: When a house is edited, the changes are reflected only the image is not on the details page,
            even though
            it
            appears correctly on the homepage and within the recommended section on the details page.
            On the edit page itself the file input is not working correctly, it doesn't show the image that is already
            selected it says only the name of that file.
          </p>
        </li>
        <li>
          <p>
            Creation Issues: It creates the house and shows the details on the detailPage of that house but not the img.
          </p>
        </li>
      </ul>
    </div>
    <div id="about-developer">
      <h1>About Developer</h1>
      <p>Alexander Zoet
        I am Alexander Zoet, an enthusiastic front-end developer who loves discovering new technologies.
        My specialty is designing user-friendly websites using modern tools such as HTML, CSS, JavaScript, and
        Bootstrap.
        I am currently studying at BIT Academy and deepening my knowledge of JavaScript.</p>
      <div class="img-container">
        <img id="Developer" src="../assets/AlexanderZoet.jpg" alt="">
      </div>
    </div>
    <div id="aboutme-container">
      <h1>About DTT</h1>
      <p>From a small student room startup in 2010 to a full-service digital agency in the heart of Amsterdam, our
        journey is one of remarkable growth and success—one we’re incredibly proud of.

        Our team, comprising over 50 enthusiastic professionals, operates daily from the vibrant heart of Amsterdam. We
        work on a broad range of projects for a diverse clientele. These include independent entrepreneurs, startups,
        public sector organizations, SMEs, multinational corporations like Randstad, and nonprofits such as Greenpeace.

        Working with clients who have unique goals, target audiences, and resources constantly challenges us to craft
        tailored digital solutions. This variety enriches our expertise, enhances our adaptability, and makes us
        exceptionally versatile. This dynamic approach is the foundation of our strength.

        We are driven by a deep commitment to our clients and their aspirations. From the very first brainstorming
        session to strategy development, solution implementation, and ongoing support, we remain by their side every
        step of the way.

        Accessibility is at the core of what we do. We aim to make the digital world approachable, just like the
        solutions we develop. By involving our clients in the development process, we cultivate meaningful
        collaborations and dive enthusiastically into their industries to understand their unique needs.

        Our focus is always on results. Every decision we make is grounded in a data-driven strategy. By leveraging
        clear insights, we continuously help our clients achieve outstanding outcomes, project after project.

        This blend of passion, expertise, and a relentless drive for results is what defines us as a trusted partner for
        all digital challenges.


      </p>
      <div class="img-container">
        <img src="../assets/img_logo_dtt@3x.png" alt="DTT-logo">
      </div>
    </div>
  </div>
</template>


<style scoped>
p {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
}

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 80px;
}

#about-page-container {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  padding: 30px;
  border-radius: 50px;
  background-color: #ffff;
}

#about-developer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  padding: 30px;
  border-radius: 50px;
  background-color: #ffff;
}

#Developer {
  display: flex;
  justify-content: center;
  width: 200px;
  border-radius: 50%;
}

#aboutme-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  padding: 30px;
  margin-bottom: 100px;
  border-radius: 50px;
  background-color: #ffff;
}

.img-container {
  display: flex;
  justify-content: end;
}

img[alt="DTT-logo"] {
  display: flex;
  justify-content: center;
  width: 200px;
}
</style>