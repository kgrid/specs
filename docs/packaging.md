---
home:true
---

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

Robustness, certification, verifiability, provenance, suitability, reputation.

## Status of this document

This document is draft of a potential specification. It has no official standing of any kind and does not represent the support or consensus of any standards organisation.

## 1. Conformance 

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words may, must, must not, should, and should not are to be interpreted as described in [RFC2119].

## 2. Terminology

See [KOIO] for matching ontology terms....

#### Knowledge Object:
A collection of metadata and binary files that together have a unique identifier (including version identifier). There are three required file types: a service description, a deployment description, and one or more payload files implementing the service described by the service description, deployable using the information in the deployment description. See [Activation Spec](activation.md) for details of the roles of the these files.

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

A key goal is allowing KOs to be nearly ready to be integrated into practice. A central feature of KOs is there dual nature as digital artifacts needing to meet the FAIR principles and services that can be used at scale in a variety of systems. See [KO Whitepaper] or [What is a KO?] or [Knowledge Object Primer]....

```
naan-name-version [object root]
  ├── metadata.json
  ├── service.yaml
  ├── deployment.yaml
  ├── payload_file_1
  ├── payload_file_2
  ├── ... more payload files
  ├── payload-directory [optional]
  │     └── ... more payload files
  ├── payload_manifest.json [optional]
  ├── metadata_file_1
  ├── metadata_file_2
  └── ... more metadata files

```

### metadata.json
The metadata.json file contains the structural description of the object
```yaml
{
"@id":"ark:naan/name/version",
"@type":"koio:KnowledgeObject",
"@context":"http://kgrid.org/koio/contexts/knowledgeobject.jsonld",
"koio:packagingVersion": "2.1",
"koio:additionalMetadata": ["citations.json","domain.json",...],
"koio:hasService": "service.yaml",
"koio:hasDeployment": "deployment.yaml",
"koio:hasPayload": ["le.js", "lebyagr.json"]
"koio:hasPayloadContainer":"payload-directory"
"koio:hasPayloadManifest":"payload_manifest.json"
... additional descriptive and administrative metadata
}
```
#### Core metadata
- `@id` is a unique identifier for this object that allows it to be resolved within the knowledge grid. The Knowledge Grid currently uses [ARK](https://n2t.net/e/ark_ids.html) identifiers natively which interoperate with [EZID](http://ezid.cdlib.org) and top-level resolvers like [Name2Thing](http://www.n2t.net) and [Identifiers.org](http://www.identifiers.org). (Support for other identifiers like [DOI](http://www.doi.org)s is planned). 
    - It can either be an absolute or relative URL.
    - See [Node Identifiers](https://w3c.github.io/json-ld-syntax/#node-identifiers) section of json-ld syntax. 
- `@type` Setting this to `"koio:KnowledgeObject"` is what declares this as a Knowledge Object. The Knowledge Grid depends on this when determining whether something is a Knowledge Object.
- `@context`  is used to map koio terms to IRIs (along with other terms). Contexts can either be directly embedded into the document (an embedded context) or be referenced using a URL. Please use the koio context url: http://kgrid.org/koio/contexts/knowledgeobject.jsonld
    - See [The Context](https://www.w3.org/TR/json-ld/#the-context) section of json-ld syntax
- `koio:packagingVersion` The metadata file must contain a koio packaging version corresponding to the version of this specification that the object follows.
- `additional descriptive and administrative metadata` we recommend using existing schemas and vocabularies (i.e. Dublin Core, etc.) when adding metadata. Some additional metadata may be required by particular implementations of Knowledge Grid components or institutional policies.

#### Parts of a knowledge object (Structural Data)
- `koio:additionalMetadata` (Proposed) an array of paths for any other metadata files that may have been created for this object.
- `koio:hasService` the path to the service description file in this Knowledge Object
- `koio:hasDeployment` the path to the deployment description file in this Knowledge Object
- `koio:hasPayload` an array of paths to files in the executable payload.
- `koio:hasPayloadContainer` (Proposed) a path to the directory containing payload files
- `koio:hasPayloadManifest` (Proposed) a path to a manifest file that describes the files in the payload.

### Service Description
The Service Description is an [OpenAPI 3](http://spec.openapis.org/oas/v3.0.3) document that describes the services (endpoints) implemented by the knowledge object. Each path should correspond to an element in the Deployment Descriptor (which describes the implementation of the endpoint). Each path should describe the request and response characteristics of the endpoint exposed by the API.
- The OpenAPI Server endpoint should use a relative URL that matches the knowledge object identifier. (URLs are relative to the server the service.yaml was fetched from; `servers` element should point to `/naan/name`).
- Has an API version, NOT a code version
- Should describe the schemas for the inputs and outputs
- Add `x-kgrid-activation` for each path with deployment information (deprecated in favor of Deployment Description)
- Service paths may be multi-level (e.g. `/welcome/hello/howdy`)

### Deployment Description
```
"@id": ark:/naan/name/version
endpoints:
  /hello:
      artifact:
        - 'src/hello.js'
        - 'src/utils.js'
      adapter: 'PROXY'
      engine: 'node'
      entry: 'src/hello.js'
      function: 'sayHello'
  /goodbye:
      artifact:
        - 'src/GoodBye.java'
        - 'src/SomeOtherFile.java'
      adapter: 'PROXY'
      engine: 'java'
      entry: 'src/GoodBye.java'
      function: 'main'
```
Must describe each endpoint that the service implements. Each endpoint must correspond to one in the Service Description. Should be a linked data resource.
- Must have an `id` field that can be resolved to the KO on the shelf.
- Uses the same identifiers (currently ARK) as other kgrid components.

##### Properties required by Activator
- `endpoints` (Required) Is the map of service paths to deployment information for that path.
- `/<endpoint path>` (Required) These are the paths for each endpoint.
    - `adapter` (Required, will be deprecated soon) specifies which adapter the activator should use to manage activation with the appropriate runtime. Currently can be `JAVASCRIPT` or `PROXY`. See [Runtime Adapters](./runtime-adapter.md)
    - `engine` The runtime that this Knowledge Object needs to be activated in.
##### Properties required by Runtimes
- `artifact` (Required) An array pointing to each artifact this endpoint depends upon. These artifacts are loaded by a runtime at the time of activation. These paths are relative to the Deployment Description.
- `entry` path to the file in the payload that contains the entry point, or "main" method. 
- `function` the main method that will be called to activate the object.
    
### Payload Files
The files related to the implementation of the services that this Knowledge Object provides. 
- Can be in a directory, or all at top level, and should be referenced by the Metadata.json in the `hasPayload` element. 
- Payload files listed in the `hasPayload` element are useful for object browsing in libraries, signing, diffing two objects, etc. (The specification of payload objects is currently under development).
- Payload files may be human or machine readable and of any type.
- Payload files are limited in size only by the limits of the operating system. 
- There is no limit to the number of payload files. 
- Payload files should be organized in a way that is natural for the code that implements the service.

##### Payload Manifest File (Proposed)
A json or yaml file that lists payload files in the same format that is used by `hasPayload` in metadata.json. Absolute or relative references are accepted. 
### Additional Metadata (Proposed)
Any additional files containing information that may be useful to those using this Knowledge Object. For example, linking CBK with supporting/corroborative sources, incl. provenance and additional domain and other descriptive metadata (is extensible).

## 4. Versioning 
- both resource and service; e.g. artifact and API versioning
- Should use semantic versioning, but may use a versioning scheme appropriate for the particular knowledge domain.
- Service API versions may change less often than code versions.
- (Proposed) Multiple versions of the same object may be packaged together as a knowledge object collection.
- API version (in Service Description: OpenAPI 3 version element) and code version (in metadata.json) do not have to be in sync, but KO developers should consider incrementing the API patch version when releasing new versions of an object even if the API did not change.
- (Proposed) Version strings should be added to the identifier as a qualifier for the ARK (See "ARK Anatomy" section of [ARK docs](https://n2t.net/e/ark_ids.html) as well as "Base Identifier Extensions" in [Identifier Concepts and Practices](https://ezid.cdlib.org/learn/id_concepts) at the California Digital Library).

## 5. (Proposed) Integrity and Signing
## 6. (Proposed) Packaging Collections
