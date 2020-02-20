# Introduction

This section is non-normative.

This Knowledge Object Common Packaging (KOCP) specification describes an application-independent approach to the storage of computable knowledge objects in a structured, transparent, and predictable manner. The KOCP spec is suitable for serialization and distribution of KOs. It is also the native dissemination and submission package for the Library component of Knowledge Grid (import/export). It also acts as the activatable/runnable package for the Activator component of the Knowledge Grid.


## Purpose

Systems are being designed and built to help move biomedical knowledge into practice more quickly, more broadly, more accurately than ever before. Those systems will rely on long-term access and management of compound digital objects within digital repositories, and deployment and integration of these objects as services in a broad class of runtimes (See KGRID Activation Spec). This requires infrastructural standards and specifications that enable integration at scale.                     

These KOCP specification arose from our work on the Knowledge Grid. The KGrid platform is focused on the externalization of computable knowledge in a readily managed and easily deployable form. We call a particular implementation of computable knowledge, packaged and ready for use in line with this specification, a Knowledge Object (KO). We face a challenge because the KOs have a dual nature, being managed as first-class digital artifacts (see FAIR principles) *and* as enablers of services in practice.

To be successful at both, the KOs should be packaged with useful descriptive and semantically appropriate structural metadata, and minimal required provenance metadata. With reference to the [OAIS] model, this might include descriptive, administrative, structural, representation and preservation metadata relevant to the object. A KO also requires standards-based descriptions of the services the object can provide and some hints about how to get it running, as well as the actual executable code and other resources.

The KOCP spec represents our recommendations on how to meet the following needs:

#### Externalization

To allow computable knowledge to be externalized and expressed as services

#### Service Orientation

To allow computable knowledge to be externalized and expressed as services

#### Interoperability

##### To interoperate with existing repositories 

##### To interoperate with a variety of runtime/deployment environments

#### Semantic Richness
Both for computation and domain concerns, semantic web ready. Open API, LDP, Dublin core, KOIO, 

#### Versioning

Semantic versioning; archival, implementation, and API versioning

#### Trust

Robustness, certifaction, verifiability, provenance, suitability, reputation.

## Status of this document

This document is draft of a potential specification. It has no official standing of any kind and does not represent the support or consensus of any standards organisation.

## 1. Conformance 

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words may, must, must not, should, and should not are to be interpreted as described in [RFC2119].

## 2. Terminology

See [KOIO] for matching ontology terms....

#### Knowledge Object:
A collection of metadata and binary files that together have a unique identifier (including version identifier). There are three required file types: a service description, a deployment description, and one or more payload files implementing the service described by the service description, deployable using the information in the deployment description. See [Activation Spec] for details of the roles of the these files.

> KOIO term — koio:KnowledgeObject

#### Service Description:

(Required) An document consisting of one or more files describing the services or services ([endpoints]) provide by the payload of the Knowledge Object. The service description follows the [OpenAPI V3] specification. THe service specification is a complete specification of the API that will be exposed by the knowledge grid for a particular knowledge object. Clients can consume the service specification in order to navigate the API for the object or generate client code that interacts with the object. 

There is no default service description???

Currently the service description assumes a restful HTTP API.

The service provides an API version, list of endpoints, schemas for inputs and outputs, error codes etc.

> KOIO term — koio:ServiceSpecification. def., an InformationArtifact that describes a computational service that is somehow enabled by a KnowledgeObject

#### Deployment Description

A deployment descriptor  (DD) refers to a configuration file for an artifact that is deployed to some container/engine. 

In the Knowledge Grid, a deployment descriptor:
- _should_ identify a suitable runtime for the payload(s) associated with a particular endpoint. 
- _may_ also provide information to a runtime adapter about the deployment (a list of data files). These properties may be runtime specific.
- _may_ point to other artifacts used by the runtime for deployment (e.g. a Docker file)
- _must_ be a json or yaml file with an `"runtime"` key and an `"endpoints array of 

> DeploymentInstruction = def., an InformationArtifact that describes how to deploy a KnowledgeObject in the Knowledge Grid platform

#### Metadata

Metadata describing the structure and elements of the KO is contained in JSON or YAML files named according to the following scheme.... At a minimum administrative metadata should include... and structural metadata should follow the KOIO, and must be in a file named `metadata.json`. See [Conceptual KO]().

#### Implementation Version and API version

The implementation version, with the ARK (or other persistent unique ID), uniquely identifies the set of KO elements in this package and is used to name the the packaged object. The API version reference form the Service Description is not unique to the package and is not part of this Packaging Spec. See [API Version]() in the [Conceptual KO](), and [Activation spec]().

#### Endpoint

An endpoint represents a particular service offered by the KO (See #Service Description, above). Payloads may be organized to implement each payload separately or may be grouped together in Payload files. See [Activation spec]()

#### Payload

An array of binary artifacts comprising the actual implementation of one or more endpoints....

## 3. The Knowledge Object Common Package

A key goal is allowing KOs to be nearly ready to be integrated into practice. A central feature of KOs is there dual nature as digital artifacts needing to meet the FAIR principles and services that can be used at scale in a variety of systems. 

```
naan-name-version [object root]
  |__ package_metadata.json
  |__ metadata.json
  |__ service.yaml
  |__ deployment.yaml
  |__ [file_1, file_2, ....]
  |__ [metadata_file_1, metadata_file_2, ...]

```
The metadata.json file contains the structural description of the object
```yaml
{
...
"koio:packagingVersion": "2.1", //move to its own file
"koio:additionalMetadata": ["citations.json","domain.json",...],
"koio:hasService": "service.yaml",
"koio:hasDeployment": "service.yaml",
--"koio:hasPayload": ["le.js", "lebyagr.json"],--
"koio:hasPayload": "content"
...
```

---
---

### Notes:

### Describing KAAR (common vocabularies and standard identifiers; suitable as a SIP)

### Describing KAAS (KOIO and OpenAPI)

### Linking CBK with supporting/corroborative sources, incl. provenance 

### Additional domain and other descriptive metadata (is extensible)

### Versioning (both resource and service; e.g. artifact and API versioning)

### Some access to relevant artifacts in the package (KAAR/KAAS)

### Insuring the integrity of the package (at least as a whole) at the point of deployment

### Storage diversity (both LDP/RDF/Graph and simple file/cache storage)

### Ability to package multiple KOs as a collection with some integrity checks

### KO types: 
- Data, Query, Lookup, Calculation, ...
- Result of a deliberative, analytic process
- Susceptible to scale stories
- Externalizable knowledge with fairly clear boundaries/characterization

