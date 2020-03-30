# Introduction

The Activator is a reference implementation of the **activation** spec. This specification focuses on client interactions and integration with with various client systems. See runtime adapter development guide for more on how an Activator manages and interacts with runtimes. 

## Responsibilities of the Activator (...)

- provide access (HTTP Restful API) to the services (exposed as endpoints) from knowledge objects deployed to the Activator
- Provide status for associated runtimes, KOs deployed, and the Activator itself
- Allow KOs to be loaded/activated from local and remote source (in suitable runtimes)
- Manage and interface with suitable runtimes — embedded, native, remote (proxy)
- Enforce some aspects of trust, provenance, and reproducibility via policy, validation, and tracing/logging.

# Endpoints

## Status

`/health`
`GET`

## Activation

`/activate`

## Knowledge Objects (Request API)

`/kos`

`POST`

## KO Endpoints

### Current

`/endpoints`

### Proposed

`/kos`

`/kos/99999/fk4tr56`

```json
{
"arkId": "ark:/99999/fk4tr56",
... (metadata)
"endpoints": ["/questions","/answers"],
"activated": "true"
}
```

##
