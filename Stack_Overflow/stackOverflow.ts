enum AccountStatus {
  active = "active",
  blocked = "blocked",
  closed = "closed"
}

class Vote {
  user: Member | Admin | Moderator
  vote: number
  date: Date

  constructor(user: Member | Admin | Moderator, vote: number, date: Date) {
    this.user = user
    this.vote = vote
    this.date = date
  }
}

class Tag {
  tag: string

  constructor(tag: string) {
    this.tag = tag
  }
}

class Badge {
  name: string
  desc: string

  constructor(name: string, desc: string) {
    this.name = name
    this.desc = desc
  }
}

class Account {
  id: number
  name: string
  email:string
  accountStatus: AccountStatus

  constructor(id: number, name: string, email: string, accountStatus: AccountStatus){
    this.id = id
    this.name = name
    this.email = email
    this.accountStatus = accountStatus
  }
}

class Entity {
  id: number
  creator: Member | Admin | Moderator
  createdDate: Date
  votes: Vote[]
  comments: PostComment[]
  isFlagged: boolean

  constructor(id: number, creator: Member | Admin | Moderator, createdDate: Date, votes: Vote[], comments: PostComment[] = []) {
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
  voteEntity(vote: Vote) {
    this.votes.push(vote)
  }
  addComment(comment: PostComment) {
    this.comments.push(comment)
  }
}

class PostComment extends Entity {
  message: string
  constructor(id: number, creator: Member | Admin | Moderator, createdDate: Date, votes: Vote[] = [], message: string){
    super(id, creator, createdDate, votes)
    this.message = message
  }
}

class Answer extends Entity {
  answer: string
  constructor(id: number, creator: Member | Admin | Moderator , createdDate: Date, votes: Vote[] = [], comments: PostComment[] = [], answer: string) {
    super(id, creator, createdDate, votes, comments)
    this.answer = answer
  }
}

class Question extends Entity {
  answers: Answer[]
  tags: Tag[]
  title: string
  body: string

  constructor(id: number, creator: Member | Admin | Moderator, createdDate: Date, votes: Vote[] = [], comments: PostComment[] = [], answers: Answer[] = [], tags: Tag[] = [], title: string, body: string) {
    super(id, creator, createdDate, votes, comments)
    this.answers = answers
    this.tags = tags
    this.title = title
    this.body = body
  }

  addAnswer(answer: Answer) {
    this.answers.push(answer)
  }
  addTag(tag: Tag) {
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

class User {
  id: number
  search: Search

  constructor(id: number, search: Search) {
    this.id = id
    this.search = search
  }

  getQuestions(questions: Question[]) {
    return questions
  }
}

class Member extends User {
  account: Account
  badges: Badge[]
  questions: Question[]
  title: string
  body: string

  constructor(id: number, search: Search, account: Account, badges: Badge[] = [], title: string, body: string) {
    super(id, search)
    this.account = account
    this.badges = badges
    this.questions = []
    this.title = title
    this.body = body
  }

  addQuestion(question: Question) {
    this.questions.push(question)
  }
  addAnswer(question: Question, answer: Answer) {
    question.addAnswer(answer)
  }
  addComment(entity: Entity, comment: PostComment) {
    entity.addComment(comment)
  }
  addVote(entity: Entity, vote: Vote) {
    entity.voteEntity(vote)
  }
  addTag(question: Question, tag: Tag) {
    question.addTag(tag)
  }
  flag(entity: Entity) {
    entity.flagEntity()
    console.log(`${this.id} flagged the post.`)
  }
  getBadge(badge: Badge) {
    this.badges.push(badge)
  }
}

class Moderator extends Member {
  constructor(id: number, search: Search, account: Account, badges: Badge[] = []) {
    super(id, search, account, badges)
  }
  deleteQuestion(question: Question) {
    this.questions = this.questions.filter(q => q.id != question.id)
  }
}

class Admin extends Member {
    constructor(id: number, search: Search, account: Account, badges: Badge[] = []) {
        super(id, search, account, badges)
    }
}

class Search {
  searchByTag(tag: string, questions: Question[]) {
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

const comment = new PostComment(808, user2, new Date(), [], [], "This is important question")
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
result.forEach((q: { display: () => any }) => console.log(q.display()))