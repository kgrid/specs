# Introduction

The Activator is a reference implementation of the **activation** spec. This specification focuses on client interactions and integration with with various client systems. See runtime adapter development guide for more on how an Activator manages and interacts with runtimes. 

## Responsibilities of the Activator (...)

- provide access (HTTP Restful API) to the services (exposed as endpoints) from knowledge objects deployed to the Activator
- Provide status for associated runtimes, KOs deployed, and the Activator itself
- Allow KOs to be loaded/activated from local and remote source (in suitable runtimes)
- Manage and interface with suitable runtimes — embedded, native, remote (proxy)
- Enforce some aspects of trust, provenance, and reproducibility via policy, validation, and tracing/logging.


## Purpose

Systems are being designed and built to help move biomedical knowledge into practice more quickly, more broadly, more accurately than ever before. Those systems will rely on long-term access and management of compound digital objects within digital repositories, and deployment and integration of these objects as services in a broad class of runtimes (See KGRID Activation Spec). This requires infrastructural standards and specifications that enable integration at scale.                     

This spec represents our recommendations on how to meet the following needs:

### ...

## Status of this document

This document is draft of a potential specification. It has no official standing of any kind and does not represent the support or consensus of any standards organisation.

## 1. Conformance 

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words *may*, must, must not, should, and should not are to be interpreted as described in [RFC2119].

## 2. Terminology

See [KOIO] for matching ontology terms....

#### Knowledge Object (KO):
A collection of metadata and binary files that together have a unique identifier (including version identifier). There are three required file types: a service description, a deployment description, and one or more payload files implementing the service described by the service description, deployable using the information in the deployment description. See [Activation Spec] for details of the roles of the these files.
> KOIO term — koio:KnowledgeObject
 
#### Shelf:

#### KO Endpoint:
A service path exposed by a particular knowledge object. Takes the form `/naan/name/endpoint`

#### Archival Resource Key (ARK):

#### Manifest:

#### Activate:

#### Runtime

#### Adapter


## Request API



## Activation API (or is it just Loading?)

??? 

## Shelf API

An Activator must implement at least the read-only portion of the [Shelf API](shelf-api.md). This includes listing KOs, returning representations of indivdual KOs (e.g. metadata only, with links to key components).

(Proposed) An activator must provide a resource representation for the knowledge object that includes activation status and endpoints.

(Proposed) An Activator should make available the service description for a knowledge object. 

(Proposed) Access to the internals of the KO (deployment and payload files) should not be exposed, except that KOs of "resource" type may specify particular payloads for client access under appropriate service paths in the service description.

(Proposed) An activator may implement additional operations for the Shelf API to support development or demonstration of KOs. For example, uploading or importing KOs, loading KOs from a manifest file, deleting KOs. See [Shelf API](shelf-api.md) for more info.

(Proposed) It is especially useful for Activators used in protyping and demonstration to allow a manfifest to be posted to the activator in prder to load KOs at runtime. This should not be enabled by default except in development environments as it representas an vulnberabiltiy.

### List KO resources
```
GET /kos HTTP/1.1
Accept: application/json
```
Returns a list of knowledge object resources in a minimal representation

```
HTTP/1.1 200
Content-Type: application/json
[{
"@id": "ipp-lowercholesterol",
"@type": "koio:KnowledgeObject",
...
},
{
"@id": "99999-fk4md04x9z",
"@type": "koio:KnowledgeObject",
...
}]
```
### Get an individual KO resource

```
GET /kos/{naan}/{name} HTTP/1.1
Accept: application/json
```
### Get a versioned individual KO resource
```
GET /kos/{naan}/{name}/{version} HTTP/1.1
Accept: application/json
```
Returns a single knowledge object resource in a minimal representation. If a version is supplied that version is returned. If no version is supplied and multiple versions of the object exist in the Activator the current default version for requests is returned (the version will be available in the returned metadata representation). See [#Default KO versions]() for more info.

```
HTTP/1.1 200
Content-Type: application/json
[{
"@id": "ipp-lowercholesterol",
"@type": "koio:KnowledgeObject",
...
},
{
"@id": "99999-fk4md04x9z",
"@type": "koio:KnowledgeObject",
...
}]
```

## Application and Health Information
Activators should provide application and health information via `/health` and `/info` endpoints. 

### `/health` (Required)

The health enpoint must provide a `{ "status": "<UP|DOWN>" } response at a minimum. The `/health` endpoint should  indicate the status of individual components (adapters, shelf cdo store, runtimes, KOs and their activation status) to aid montioring in troubleshooting Activator deployments.

We suggest following the conventions in the [Spring Boot production health information guidelines](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-health). 

Health information should focus on details that help understand wy the Activator or a component is `up` or `down`. Extended information may be made available under an `/info` endpoint. See `/info` below.

```
GET /health HTTP/1.1
Accept: application/json
```
An `UP` response returns an overall status and a map of indivdual componet statuses:

```
HTTP/1.1 200
Content-type: application/json
{
  "status": "UP",
  "components": {
    "activationService": {
      "status": "UP",
      "details": {
        "kos": 0,
        "endpoints": 0
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 500068036608,
        "free": 336108306432,
        "threshold": 10485760,
        "exists": true
      }
    },
    "org.kgrid.adapter.javascript.JavascriptAdapter": {
      "status": "UP",
      "details": {
        "type": "JAVASCRIPT",
        "created": "2020-06-18T18:07:52.492425Z"
      }
    },
    ...
  }
}
```

A `DOWN` response returns:

```
HTTP/1.1 503 
Content-type: application/json
{
  "status": "UP",
  "components": {
    "activationService": {
      "status": "UP"
    },{
      "org.kgrid.adapter.javascript.JavascriptAdapter": {
      "status": "DOWN"
    },
      ...
}
```
An Activator implementation may use additional statuses as needed which can be documented for deployers, etc.

### `/info` (Optional)

Additional or extended information about the opertating characteristics of the Activator can be made available under an `/info` endpoint. See [Spring Boot application health information guidelines](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-application-info) for examples of suitable patterns which can be implemented in many different frameworks and languages.

We suggest that implementations provide things like a list of adapters and runtimes currently deployed, as well as counts or lists of KOs available to the Activator, endpoints activated, perhaps total requests, uptime, build information, key environemnt variables, etc.

Be careful not to expose sensitive information. The `/health` and `/info` endpoints should be secured (e.g. with OAuth 2.0 Bearer Tokens).

The `/info` endpoint should return a map of information sets in JSON or YAML.


##Notes
How should the runtime (native, or w/ runtime adapter interface) be given the full _service_ path?
