# Microservices

Service oriented architecture

1. one microservice, one task
1. each microservice operates independently
1. microservices communicate over http

pros:

* easier to onboard new teams & add new services without touching existing code
* easier to assign services to independent teams
* easier to scale/rework specific services/functionality
* can choose the best stack for the services needs
* services failures !== app failure

cons:

* redundancies and repeated logic in multiple services, consumes more resources
* common guidelines, standards, and existing solutions must be used across all services
* updates may require updating all affected microservices
* harder to test b/c of need to mock input data
* complex network of services, harder integrate and monitor services
* needs additional infrastructure to orchestrate/manage services (routing/managing instances)

## Managing services

* service mesh: containerized apps leverage container engine to manage routing
* service registry: dedicated to identifying, registering, & load balancing services
