// new file
Writing objects: 100%
To https://github.com/aman8637/Smart-Issue-Board.git
* [new branch] main -> main
branch 'main' set up to track 'origin/main'
1. Frontend Stack Choice
Hello  am completed my project.
I used React with Vite because it is fast, easy to configure, and suitable for building scalable, component-based user interfaces. It also integrates well with Vercel for deployment.

2. Firestore Data Structure

I used a single issues collection. Each document stores title, description, priority, status, assigned user, creator email, and creation time. This structure supports easy filtering and sorting.

3. Similar Issue Handling

Before creating a new issue, the app checks existing issues for similar titles. If a match is found, the user is warned and asked to confirm before proceeding.

4. Challenges

Defining what counts as a similar issue and implementing status rules correctly were the main challenges. Managing Firebase configuration and deployment was also slightly tricky.

5. Future Improvements

I would add AI-based similarity detection, better search and filters, pagination, and improved UI feedback.
