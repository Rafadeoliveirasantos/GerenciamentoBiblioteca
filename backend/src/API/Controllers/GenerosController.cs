using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class GenerosController : ControllerBase
{
    private readonly GeneroService _service;

    public GenerosController(GeneroService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var generos = await _service.GetAllAsync();
        return Ok(generos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var genero = await _service.GetByIdAsync(id);

        if (genero == null)
            return NotFound(new { message = "Gênero não encontrado" });

        return Ok(genero);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CriarGeneroDto dto)
    {
        try
        {
            var genero = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = genero.Id }, genero);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] AtualizarGeneroDto dto)
    {
        try
        {
            var genero = await _service.UpdateAsync(id, dto);

            if (genero == null)
                return NotFound(new { message = "Gênero não encontrado" });

            return Ok(genero);
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
            return NotFound(new { message = "Gênero não encontrado" });

        return NoContent();
    }
}
