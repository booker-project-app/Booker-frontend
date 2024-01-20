import {TestBed} from '@angular/core/testing';
import {AccommodationService} from "./accommodation.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AccommodationUpdatedAvailabilityDTO} from "./update-availability/model/AccommodationUpdatedAvailabilityDTO";
import {PriceType} from "../enums/price-type.enum";
import {UpdateAvailabilityDTO} from "./update-availability/model/UpdateAvailabilityDTO";
import {AccommodationViewDto} from "./accommodation/model/accommodation-view";
import {HttpResponse} from "@angular/common/http";


describe('AccommodationService', () => {
    let service: AccommodationService;
    let httpController: HttpTestingController;

    let url = "http://localhost:8080/api/accommodations";

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(AccommodationService);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpController.verify();
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should update availability', () => {

        const accommodation: AccommodationViewDto = {
            address: {
                street: '',
                city: '',
                latitude: 0,
                longitude: 0
            },
            amenities: [],
            availabilities: [],
            comments: {},
            deadline: 0,
            description: "",
            images: [],
            manual_accepting: false,
            max_capacity: 0,
            min_capacity: 0,
            owner_id: 2,
            prices: {},
            ratings: {},
            id: 1,
            title: "neki string"
        };
        const actualResponse = new HttpResponse({
            body: {
                id: 1,
                availabilities: [{
                    startDate: new Date('2024-12-15'),
                    endDate: new Date('2024-12-31')
                }],
                prices: [{
                    id: 123,
                    cost: 150,
                    fromDate: '2024-12-15',
                    toDate: '2024-12-31',
                    type: 'PER_GUEST'
                }],
                deadline: 3
            },
            status: 200,
            statusText: 'OK',
            url: `http://localhost:8080/api/accommodations/update_availability/${accommodation.id}`
        });
        const updatedAvailability: AccommodationUpdatedAvailabilityDTO = {
            id: 1,
            availabilities: [{
                startDate: new Date("2024-12-15"),
                endDate: new Date("2024-12-31")
            }],
            prices: [{
                id: 123,
                cost: 150.0,
                fromDate: '2024-12-15',
                toDate: '2024-12-31',
                type: PriceType.PER_GUEST
            }],
            deadline: 3
        };

        const updateAvailabilityDTO: UpdateAvailabilityDTO = {
            startDate: '2024-12-15',
            endDate: '2024-12-31',
            price: {
                id: 123,
                cost: 150.0,
                fromDate: '2024-12-15',
                toDate: '2024-12-31',
                type: PriceType.PER_GUEST
            },
            deadline: 3
        };

        service.updateAvailability(accommodation.id!, updateAvailabilityDTO).subscribe((data) => {
            expect(actualResponse.body).toEqual({
                id: 1,
                availabilities: [{
                    startDate: jasmine.any(Date),
                    endDate: jasmine.any(Date)
                }],
                prices: [{
                    id: 123,
                    cost: 150,
                    fromDate: '2024-12-15',
                    toDate: '2024-12-31',
                    type: 'PER_GUEST'
                }],
                deadline: 3
            });
        });

        const req = httpController.expectOne({
            method: 'POST',
            url: `${url}/update_availability/${accommodation.id}`
        });

        req.flush(updatedAvailability);
    })
});


