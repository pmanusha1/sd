class User {
  constructor(id, search) {
    this.id = id
    this.search = search
  }

  getQuestions(questions) {
    return questions
  }
}
class Member extends User {
  constructor(id, search, account, badges = []) {
    super(id, search)
    this.account = account
    this.badges = badges
    this.questions = []
  }

  addQuestion(question) {
    this.questions.push(question)
  }
  addAnswer(question, answer) {
    question.addAnswer(answer)
  }
  addComment(entity, comment) {
    entity.addComment(comment)
  }
  addVote(entity, vote) {
    entity.voteEntity(vote)
  }
  addTag(question, tag) {
    question.addTag(tag)
  }
  flag(entity) {
    entity.flagEntity()
    console.log(`${this.id} flagged the post.`)
  }
  getBadge(badge) {
    this.badges.push(badge)
  }
}
class Moderator extends Member {
  deleteQuestion(question) {
    this.questions = this.questions.filter(q => q.id != question.id)
  }
  restoreQuestion(question) {}
}

class Admin extends Member {
  blockMember(memId) {}
  unblockMember(memId) {}
}

class Account {
  constructor(id, name, email, accountStatus){
    this.id = id
    this.name = name
    this.email = email
    this.accountStatus = accountStatus
  }
}

const AccountStatus = Object.freeze({
  active: "active",
  blocked: "blocked",
  closed: "closed"
})

class Badge {
  constructor(name, desc) {
    this.name = name
    this.desc = desc
  }
}

class Entity {
  constructor(id, creator, createdDate, votes, comments = []) {
    this.id = id
    this.creator = creator
    this.createdDate = createdDate
    this.votes = votes
    this.comments = comments
    this.isFlagged = false
  }

  flagEntity() {
    this.isFlagged = true
  }
  voteEntity(vote) {
    this.votes.push(vote)
  }
  addComment(comment) {
    this.comments.push(comment)
  }
}

class Question extends Entity {
  constructor(id, creator, createdDate, votes, comments = [], answers = [], tags = [], title, body) {
    super(id, creator, createdDate, votes, comments)
    this.answers = answers
    this.tags = tags
    this.title = title
    this.body = body
  }

  addAnswer(answer) {
    this.answers.push(answer)
  }
  addTag(tag) {
    this.tags.push(tag)
  }

  display() {
    const answersText = this.answers.map(answer => `- ${answer.answer}`).join('\n') 
    const CommentText = this.comments.map(comment => `-${comment.message}`).join('\n')

    return `Question ID: ${this.id}
      Title: ${this.title}
      Body: ${this.body}
      Tags: ${this.tags.map(t => t.tag).join(", ")}
      Votes: ${this.votes.length}
      Answers: ${answersText}
      Comments: ${CommentText}\n`
  }
}

class Answer extends Entity {
  constructor(id, creator, createdDate, votes, comments = [], answer) {
    super(id, creator, createdDate, votes, comments)
    this.answer = answer
  }
}

class PostComment extends Entity {
  constructor(id, creator, createdDate, votes, comments = [], message){
    super(id, creator, createdDate, votes, comments)
    this.message = message
  }
}

class Vote {
  constructor(user, vote, date) {
    this.user = user
    this.vote = vote
    this.date = date
  }
}

class Tag {
  constructor(tag) {
    this.tag = tag
  }
}
class Search {
  searchByTag(tag, questions) {
    return questions.filter(question =>
      question.tags.some(q => q.tag === tag)
    )
  }
}

const search = new Search()

const userAccount = new Account(76, 'manusha', 'manusha@gmail.com', AccountStatus.active)

const user = new Member(123, search, userAccount, [])

const badge = new Badge('Good', 'Good')
user.getBadge(badge)

const vote = new Vote(user, 1, new Date())

const question = new Question(
  90,
  user,
  new Date(),
  [],
  [],
  [],
  [],
  "What is System Designs?",
  "Can someone explain what system designs means in software engineering?"
)
user.addQuestion(question)
user.addVote(question, vote)

const User2Account = new Account(44, 'lavi', 'lavi@gmail.com', AccountStatus.active)
const user2 = new Member(40, search, User2Account, [])

const comment = new PostComment(808, user2, new Date(), [], "This is important question")
question.addComment(comment)

const adminAccount = new Account(60, 'admin', 'admin@gmail.com', AccountStatus.active)
const admin = new Admin(70, search, adminAccount, [])

const answer = new Answer(80, admin, new Date(), [], [], 'Asnwer to the Question')
question.addAnswer(answer)
answer.addComment(comment)
user.addVote(answer, vote)

const tag = new Tag('System Designs')
question.addTag(tag)

const result = user.search.searchByTag("System Designs", user.questions)
result.forEach(q => console.log(q.display()))
