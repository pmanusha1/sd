from dataclasses import dataclass
from typing import List
from enum import Enum
from datetime import date, time

@dataclass
class User:
    id: int
    search: "Search"

    def getQuestions(questions):
        return questions

@dataclass
class Search:
    def searchByTag(self, tag, questions):
        res = []
        for question in questions:
            for t in question.tags:
                if t == tag:
                    res.append(question)
        return res

@dataclass
class Member(User):
    name: str
    email: str
    account: "Account"
    badges: List["Badge"]
    questions: List["Question"]

    def addQuestion(self, question):
        self.questions.append(question)
    
    def addAnswer(self, question, answer):
        question.addAnswer(answer)
    
    def addComment(self, entity, comment):
        entity.addComment(comment)
    
    def addVote(self, entity, vote):
        entity.addVote(vote)
    
    def flag(self, entity):
        entity.flagEntity()
    
    def getBadges(self, badge):
        self.badges.append(badge)

@dataclass
class Admin(Member):
    def blockUser(id):
        pass

    def unblock(id):
        pass

@dataclass
class Moderator(Member):
    def deleteQuestion(questions, question):
        for ques in questions:
            if ques.id == question.id:
                questions.remove(question)
        return question


@dataclass
class Badge:
    title: str
    desc: str

@dataclass
class Account:
    id: int
    accountStatus: "AccountStatus"

class AccountStatus(Enum):
    active = "active"
    closed= "closed"
    blocked = "blocked"

@dataclass
class Entity:
    id: int
    creator: None
    createdDate: date
    comments: List["Comment"]
    votes: "Vote"
    isFlagged: bool

    def addComment(self, comment):
        self.comments.appnd(comment)
    
    def addVote(self, vote):
        self.votes += vote
    
    def flagEntity(self):
        self.isFlagged = True

@dataclass
class Comment(Entity):
    message: str

@dataclass
class Question(Entity):
    answers: List["Answer"]
    tags: List["Tag"]

    def addAnswer(self, answer):
        self.answers.append(answer)
    
    def addTag(self, tag):
        self.tags.append(tag)
    
    def display(self, question):
        ansText = '\n'.join(f"-{answer.answer}" for answer in self.answers)
        commentText = '\n'.join(f"-{comment.message}" for comment in self.comments)
        tagsText = ', '.join(f"{tag.tag}" for tag in self.tags)

        return (
            f"Question Id: {question.id}\n"
           f"Title: {question.title}\n"
           f"Body: {question.body}\n"
           f"Tags: {tagsText}\n"
           f"Votes: {question.votes}\n"
           f"Answers: {ansText}\n"
           f"Comment: {commentText}\n"
        )

@dataclass
class Answer(Entity):
    answer: str

@dataclass
class Tag:
    tag: str

@dataclass
class Vote:
    vote: int

search = Search()

userAccount = Account(90, AccountStatus.active)

user = Member(78, search, 'manu', 'manu@gmail.com', userAccount, [], [])

badge = Badge("Good", "Good")
user.getBadges(badge)

question = Question(
    80,
    user,
    datetime.today().date(),
    [],
    None,
    False,
    [],
    [],
    "What is System Designs?",
    "Can someone explain what system designs means in software engineering?"
)

vote = Vote(1)
question.addVote(vote)

adminAccount = Account(50, AccountStatus.active)
admin = Admin(60, search, 'admin', 'admin@gmail.com', adminAccount, [], [])

comment = Comment(55, admin, date(), [], None, False, "This is important question")
question.addComment(comment)

answer = Answer(70, admin, date(), [], None, False, "Blueprints for a software or hardware system")
admin.addAnswer(answer)

ansComment = Comment(66, user, date(), [], None, False, "That's correct")
user.addComment(answer, ansComment)

tag = Tag("System Design")
question.addTag(tag)

result = user.search.searchByTag(tag, user.questions)
for q in result:
    print(q.display())