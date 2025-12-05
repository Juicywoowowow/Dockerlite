"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../dist/index.js");
describe('Complex Snapshot Testing', () => {
    test('snapshots a complete user profile', () => {
        const userProfile = {
            id: 12345,
            username: 'johndoe',
            email: 'john@example.com',
            profile: {
                firstName: 'John',
                lastName: 'Doe',
                age: 30,
                bio: 'Software developer and open source enthusiast',
                location: {
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'USA',
                    coordinates: {
                        lat: 37.7749,
                        lng: -122.4194
                    }
                }
            },
            preferences: {
                theme: 'dark',
                notifications: {
                    email: true,
                    push: false,
                    sms: true
                },
                privacy: {
                    profileVisible: true,
                    showEmail: false,
                    showLocation: true
                }
            },
            stats: {
                posts: 142,
                followers: 1523,
                following: 892,
                likes: 3421
            },
            recentActivity: [
                { type: 'post', id: 1, timestamp: '2024-01-15T10:30:00Z' },
                { type: 'like', id: 2, timestamp: '2024-01-15T09:15:00Z' },
                { type: 'comment', id: 3, timestamp: '2024-01-14T18:45:00Z' }
            ]
        };
        expect(userProfile).toMatchSnapshot();
    });
    test('snapshots API response structure', () => {
        const apiResponse = {
            status: 200,
            message: 'Success',
            data: {
                users: [
                    { id: 1, name: 'Alice', role: 'admin' },
                    { id: 2, name: 'Bob', role: 'user' },
                    { id: 3, name: 'Charlie', role: 'moderator' }
                ],
                pagination: {
                    page: 1,
                    perPage: 10,
                    total: 3,
                    totalPages: 1
                }
            },
            meta: {
                requestId: 'req_abc123',
                timestamp: '2024-01-15T12:00:00Z',
                version: 'v1'
            }
        };
        expect(apiResponse).toMatchSnapshot();
    });
    test('snapshots complex nested arrays', () => {
        const complexData = {
            matrix: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ],
            tree: {
                value: 'root',
                children: [
                    {
                        value: 'child1',
                        children: [
                            { value: 'grandchild1', children: [] },
                            { value: 'grandchild2', children: [] }
                        ]
                    },
                    {
                        value: 'child2',
                        children: [
                            { value: 'grandchild3', children: [] }
                        ]
                    }
                ]
            }
        };
        expect(complexData).toMatchSnapshot();
    });
    test('snapshots with mixed data types', () => {
        const mixedData = {
            string: 'hello',
            number: 42,
            float: 3.14159,
            boolean: true,
            nullValue: null,
            undefinedValue: undefined,
            array: [1, 'two', 3, 'four'],
            nested: {
                deep: {
                    deeper: {
                        deepest: 'value'
                    }
                }
            },
            emptyArray: [],
            emptyObject: {}
        };
        expect(mixedData).toMatchSnapshot();
    });
    test('snapshots multiple times in same test', () => {
        const step1 = { stage: 'initial', value: 0 };
        expect(step1).toMatchSnapshot();
        const step2 = { stage: 'processing', value: 50 };
        expect(step2).toMatchSnapshot();
        const step3 = { stage: 'complete', value: 100 };
        expect(step3).toMatchSnapshot();
    });
    test('snapshots array of objects', () => {
        const products = [
            {
                id: 'prod_001',
                name: 'Laptop',
                price: 999.99,
                specs: {
                    cpu: 'Intel i7',
                    ram: '16GB',
                    storage: '512GB SSD'
                },
                tags: ['electronics', 'computers', 'portable']
            },
            {
                id: 'prod_002',
                name: 'Mouse',
                price: 29.99,
                specs: {
                    type: 'wireless',
                    dpi: 1600,
                    buttons: 5
                },
                tags: ['electronics', 'accessories', 'peripherals']
            },
            {
                id: 'prod_003',
                name: 'Keyboard',
                price: 79.99,
                specs: {
                    type: 'mechanical',
                    switches: 'Cherry MX Blue',
                    backlight: 'RGB'
                },
                tags: ['electronics', 'accessories', 'peripherals', 'gaming']
            }
        ];
        expect(products).toMatchSnapshot();
    });
    test('snapshots configuration object', () => {
        const config = {
            app: {
                name: 'MyApp',
                version: '2.1.0',
                environment: 'production'
            },
            database: {
                host: 'localhost',
                port: 5432,
                name: 'myapp_db',
                pool: {
                    min: 2,
                    max: 10
                }
            },
            cache: {
                enabled: true,
                ttl: 3600,
                provider: 'redis',
                options: {
                    host: 'localhost',
                    port: 6379
                }
            },
            features: {
                authentication: true,
                analytics: true,
                notifications: false,
                beta: {
                    newUI: true,
                    aiAssistant: false
                }
            },
            limits: {
                maxUploadSize: 10485760, // 10MB
                maxRequestsPerMinute: 100,
                maxConcurrentConnections: 1000
            }
        };
        expect(config).toMatchSnapshot();
    });
    test('snapshots graph structure', () => {
        const graph = {
            nodes: [
                { id: 'A', label: 'Node A', x: 0, y: 0 },
                { id: 'B', label: 'Node B', x: 100, y: 0 },
                { id: 'C', label: 'Node C', x: 50, y: 100 },
                { id: 'D', label: 'Node D', x: 150, y: 100 }
            ],
            edges: [
                { from: 'A', to: 'B', weight: 5 },
                { from: 'A', to: 'C', weight: 3 },
                { from: 'B', to: 'D', weight: 7 },
                { from: 'C', to: 'D', weight: 2 }
            ],
            metadata: {
                directed: true,
                weighted: true,
                nodeCount: 4,
                edgeCount: 4
            }
        };
        expect(graph).toMatchSnapshot();
    });
});
describe('Snapshot Edge Cases', () => {
    test('snapshots empty structures', () => {
        expect({}).toMatchSnapshot();
        expect([]).toMatchSnapshot();
        expect({ empty: {} }).toMatchSnapshot();
    });
    test('snapshots with special characters', () => {
        const specialChars = {
            quotes: 'He said "hello"',
            apostrophe: "It's working",
            newline: 'Line 1\nLine 2',
            tab: 'Column1\tColumn2',
            unicode: '🎉 Celebration! 🎊',
            backslash: 'C:\\Users\\Documents'
        };
        expect(specialChars).toMatchSnapshot();
    });
    test('snapshots large array', () => {
        const largeArray = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            value: i * 2,
            label: `Item ${i}`
        }));
        expect(largeArray).toMatchSnapshot();
    });
    test('snapshots deeply nested object', () => {
        const deepNest = {
            level1: {
                level2: {
                    level3: {
                        level4: {
                            level5: {
                                level6: {
                                    level7: {
                                        level8: {
                                            level9: {
                                                level10: {
                                                    value: 'deep value',
                                                    data: [1, 2, 3, 4, 5]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        expect(deepNest).toMatchSnapshot();
    });
});
