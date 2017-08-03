import {Component, Input, OnInit} from "@angular/core";
import {CommentService} from "../comment/comment.service";


@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.css'],
    providers: [CommentService]
})

export class CommentsComponent implements OnInit {
    @Input() parent: any;

    user: any;
    public comment: any;
    errors: any;

    constructor(private commentService: CommentService) {
        this.comment = {
            id: 0,
            body: '',
            created_at_ago: 'Just now',
        };
    }

    ngOnInit() {

    }

    onComment(body, author) {
        this.prepareComment(body, author);
        return this.commentService.addComment(this.comment, this.parent.id);
    }

    prepareComment(body, author) {
        this.comment.body = body;
        this.comment.author = author;
        this.parent.comments.unshift((<any>Object).assign({}, this.comment));
    }


}
