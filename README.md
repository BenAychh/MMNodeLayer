# Montessori Match
Finding employees who are a good cultural fit for your organization is difficult. Just as hard is finding a good place to work where your values will be aligned with the organization's. Montessori Match solves these problems for Montessori schools and teachers.

Montessori Match is an app that crosses the concepts of the job-search site and dating site to help school and teacher find good cultural fits for employment.

Schools and teachers fill out personal profiles. A proprietary algorithm compares these profiles and makes recommendations for who would be a good fit. These recommendations are shown to users, who have the option of showing interest in their recommendations. If a school and teacher both show interest in each other, they are matched, and are given contact information for each other. Schools can then start a hiring process.

[Click here for a demo of the iOS app!](https://appetize.io/app/muf44gr1zw5e73u7znufdj3hw0?device=iphone6&scale=75&orientation=portrait&osVersion=9.3)

The application is comprised of three layers. [The client-facing layer is a set of iOS and Android apps made using NativeScript.](http://github.com/dsudia/montMatchMobile). The apps interface with the layer in this repository, written in Node, which interfaces with four microservices:
* [An authorization service that handles sign up and login, written in Java, using a PostgreSQL database.](https://github.com/BenAychh/MMAuthService)
* [A profile service that holds the rest of a user's profile information, written in Java, using a PostgreSQL database](https://github.com/dsudia/mmprofileservice)
* [A matching service that tracks user's list of interests and matches, written in Java, using a PostgreSQL database](https://github.com/BenAychh/MMMatchService)
* [A matching daemon that runs the algorithm across users' matching profiles, written in Node, using a Mongo database](https://github.com/dsudia/MMMatchDaemon)

The Routing layer and Microservices were developed using the [Git Flow](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/) and Test-Driven Development processes, and deployed using a [Jenkins](https://jenkins.io)/[Docker](https://www.docker.com) system that interacts with Github to deploy services to [Amazon EC2 instances](https://aws.amazon.com/ec2/) automatically when commits pass tests.
