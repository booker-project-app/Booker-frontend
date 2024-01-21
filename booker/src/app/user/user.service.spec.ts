import {TestBed} from '@angular/core/testing';
import {UserService} from "./user.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {CreateUserDTO} from "./dto/CreateUserDTO";
import {UserType} from "../enums/user-type.enum";
import {HttpResponse} from "@angular/common/http";


describe('UserService', () => {
    let service: UserService;
    let httpController: HttpTestingController;

    let url = "http://localhost:8080/api/users";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(UserService);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpController.verify();
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should register user', () => {
        const createUser: CreateUserDTO = {
            name: "John",
            surname: "Doe",
            email: "john@example.com",
            password: "12345678",
            address: "123 Main Street",
            phone: "12345678",
            role: UserType.GUEST,
        };

        const actualResponse = new HttpResponse({
            status: 201,
            statusText: 'OK',
            url: 'http://localhost:8080/api/users/signup',
            body: {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: '$2a$10$senTM0r6kYcoWyKiJeU/Re0tYaxE8SqvdjUm.uNnQ04ELaYQ5mnxO',
                address: '123 Main Street',
                phone: '1234567890',
                role: 'GUEST'
            }
        });

        const expectedResponse: CreateUserDTO = {
            name: 'John',
            surname: 'Doe',
            email: 'john@example.com',
            password: '12345678',
            address: '123 Main Street',
            phone: '12345678',
            role: UserType.GUEST,
        };

        service.signup(createUser).subscribe((response: CreateUserDTO) => {
            expect(response).toEqual(expectedResponse);
            console.log('Sign up success');
        });

        const req = httpController.expectOne({
            method: 'POST',
            url: `${url}/signup`
        });

        req.flush(createUser);

    })

});
