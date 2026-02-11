using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class AutoresController : ControllerBase
{
    private readonly AutorService _service;

    public AutoresController(AutorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var autores = await _service.GetAllAsync();
        return Ok(autores);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var autor = await _service.GetByIdAsync(id);

        if (autor == null)
            return NotFound(new { message = "Autor não encontrado" });

        return Ok(autor);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AutorDto dto)
    {
        try
        {
            var autor = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = autor.Id }, autor);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] AutorDto dto)
    {
        try
        {
            var autor = await _service.UpdateAsync(id, dto);

            if (autor == null)
                return NotFound(new { message = "Autor não encontrado" });

            return Ok(autor);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound(new { message = "Autor não encontrado" });

        return NoContent();
    }
}
