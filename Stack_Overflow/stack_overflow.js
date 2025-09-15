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
  constructor(id, creator, createdDate, votes, comments = [], answers = [], tags = []) {
    super(id, creator, createdDate, votes, comments)
    this.answers = answers
    this.tags = tags
  }

  addAnswer(answer) {
    this.answers.push(answer)
  }
  addTag(tag) {
    this.tags.push(tag)
  }
}

class Answer extends Entity {
  constructor(id, creator, createdDate, votes, comments = [], answer) {
    super(id, creator, createdDate, votes, comments)
    this.answer = answer
  }
}

class Comment extends Entity {
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
