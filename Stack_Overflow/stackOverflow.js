var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["active"] = "active";
    AccountStatus["blocked"] = "blocked";
    AccountStatus["closed"] = "closed";
})(AccountStatus || (AccountStatus = {}));
var Vote = /** @class */ (function () {
    function Vote(user, vote, date) {
        this.user = user;
        this.vote = vote;
        this.date = date;
    }
    return Vote;
}());
var Tag = /** @class */ (function () {
    function Tag(tag) {
        this.tag = tag;
    }
    return Tag;
}());
var Badge = /** @class */ (function () {
    function Badge(name, desc) {
        this.name = name;
        this.desc = desc;
    }
    return Badge;
}());
var Account = /** @class */ (function () {
    function Account(id, name, email, accountStatus) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.accountStatus = accountStatus;
    }
    return Account;
}());
var Entity = /** @class */ (function () {
    function Entity(id, creator, createdDate, votes, comments) {
        if (comments === void 0) { comments = []; }
        this.id = id;
        this.creator = creator;
        this.createdDate = createdDate;
        this.votes = votes;
        this.comments = comments;
        this.isFlagged = false;
    }
    Entity.prototype.flagEntity = function () {
        this.isFlagged = true;
    };
    Entity.prototype.voteEntity = function (vote) {
        this.votes.push(vote);
    };
    Entity.prototype.addComment = function (comment) {
        this.comments.push(comment);
    };
    return Entity;
}());
var PostComment = /** @class */ (function (_super) {
    __extends(PostComment, _super);
    function PostComment(id, creator, createdDate, votes, message) {
        if (votes === void 0) { votes = []; }
        var _this = _super.call(this, id, creator, createdDate, votes) || this;
        _this.message = message;
        return _this;
    }
    return PostComment;
}(Entity));
var Answer = /** @class */ (function (_super) {
    __extends(Answer, _super);
    function Answer(id, creator, createdDate, votes, comments, answer) {
        if (votes === void 0) { votes = []; }
        if (comments === void 0) { comments = []; }
        var _this = _super.call(this, id, creator, createdDate, votes, comments) || this;
        _this.answer = answer;
        return _this;
    }
    return Answer;
}(Entity));
var Question = /** @class */ (function (_super) {
    __extends(Question, _super);
    function Question(id, creator, createdDate, votes, comments, answers, tags, title, body) {
        if (votes === void 0) { votes = []; }
        if (comments === void 0) { comments = []; }
        if (answers === void 0) { answers = []; }
        if (tags === void 0) { tags = []; }
        var _this = _super.call(this, id, creator, createdDate, votes, comments) || this;
        _this.answers = answers;
        _this.tags = tags;
        _this.title = title;
        _this.body = body;
        return _this;
    }
    Question.prototype.addAnswer = function (answer) {
        this.answers.push(answer);
    };
    Question.prototype.addTag = function (tag) {
        this.tags.push(tag);
    };
    Question.prototype.display = function () {
        var answersText = this.answers.map(function (answer) { return "- ".concat(answer.answer); }).join('\n');
        var CommentText = this.comments.map(function (comment) { return "-".concat(comment.message); }).join('\n');
        return "Question ID: ".concat(this.id, "\n      Title: ").concat(this.title, "\n      Body: ").concat(this.body, "\n      Tags: ").concat(this.tags.map(function (t) { return t.tag; }).join(", "), "\n      Votes: ").concat(this.votes.length, "\n      Answers: ").concat(answersText, "\n      Comments: ").concat(CommentText, "\n");
    };
    return Question;
}(Entity));
var User = /** @class */ (function () {
    function User(id, search) {
        this.id = id;
        this.search = search;
    }
    User.prototype.getQuestions = function (questions) {
        return questions;
    };
    return User;
}());
var Member = /** @class */ (function (_super) {
    __extends(Member, _super);
    function Member(id, search, account, badges) {
        if (badges === void 0) { badges = []; }
        var _this = _super.call(this, id, search) || this;
        _this.account = account;
        _this.badges = badges;
        _this.questions = [];
        return _this;
    }
    Member.prototype.addQuestion = function (question) {
        this.questions.push(question);
    };
    Member.prototype.addAnswer = function (question, answer) {
        question.addAnswer(answer);
    };
    Member.prototype.addComment = function (entity, comment) {
        entity.addComment(comment);
    };
    Member.prototype.addVote = function (entity, vote) {
        entity.voteEntity(vote);
    };
    Member.prototype.addTag = function (question, tag) {
        question.addTag(tag);
    };
    Member.prototype.flag = function (entity) {
        entity.flagEntity();
        console.log("".concat(this.id, " flagged the post."));
    };
    Member.prototype.getBadge = function (badge) {
        this.badges.push(badge);
    };
    return Member;
}(User));
var Moderator = /** @class */ (function (_super) {
    __extends(Moderator, _super);
    function Moderator(id, search, account, badges) {
        if (badges === void 0) { badges = []; }
        return _super.call(this, id, search, account, badges) || this;
    }
    Moderator.prototype.deleteQuestion = function (question) {
        this.questions = this.questions.filter(function (q) { return q.id != question.id; });
    };
    return Moderator;
}(Member));
var Admin = /** @class */ (function (_super) {
    __extends(Admin, _super);
    function Admin(id, search, account, badges) {
        if (badges === void 0) { badges = []; }
        return _super.call(this, id, search, account, badges) || this;
    }
    return Admin;
}(Member));
var Search = /** @class */ (function () {
    function Search() {
    }
    Search.prototype.searchByTag = function (tag, questions) {
        return questions.filter(function (question) {
            return question.tags.some(function (q) { return q.tag === tag; });
        });
    };
    return Search;
}());
var search = new Search();
var userAccount = new Account(76, 'manusha', 'manusha@gmail.com', AccountStatus.active);
var user = new Member(123, search, userAccount, []);
var badge = new Badge('Good', 'Good');
user.getBadge(badge);
var vote = new Vote(user, 1, new Date());
var question = new Question(90, user, new Date(), [], [], [], [], "What is System Designs?", "Can someone explain what system designs means in software engineering?");
user.addQuestion(question);
user.addVote(question, vote);
var User2Account = new Account(44, 'lavi', 'lavi@gmail.com', AccountStatus.active);
var user2 = new Member(40, search, User2Account, []);
var comment = new PostComment(808, user2, new Date(), [], "This is important question");
question.addComment(comment);
var adminAccount = new Account(60, 'admin', 'admin@gmail.com', AccountStatus.active);
var admin = new Admin(70, search, adminAccount, []);
var answer = new Answer(80, admin, new Date(), [], [], 'Asnwer to the Question');
question.addAnswer(answer);
answer.addComment(comment);
user.addVote(answer, vote);
var tag = new Tag('System Designs');
question.addTag(tag);
var result = user.search.searchByTag("System Designs", user.questions);
result.forEach(function (q) { return console.log(q.display()); });
