import {Component, OnInit, Input} from "@angular/core";
import {AuthService} from "../auth/authService";
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

    constructor(private authService: AuthService,
                private commentService: CommentService
    ){
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
        /*this.commentService.addComment(this.comment, this.parent.id).subscribe(
            () => {
                //@todo Reset form after a successful comment
                this.comment.body = '';
            },
            errors => this.errors = errors
        );*/
    }

    prepareComment(body, author) {
        this.comment.body = body;
        this.comment.author = author;
        console.log(this.comment);
        this.parent.comments.unshift((<any>Object).assign({}, this.comment));
    }




}
